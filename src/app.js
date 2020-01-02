import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import $ from 'jquery';
import isURL from 'validator/lib/isURL';
import axios from 'axios';
import { getFeedData, getNewsData, getDomDoc } from './parsers';
import getDiff from './utils';
import watchers from './watchers';

const app = () => {
  const state = {
    addNewFeed: {
      state: '',
      submitDisabled: true,
    },
    userNotification: '',
    feeds: [],
    news: [],
    updateFeedsNews: {
      state: '',
    },
  };

  const form = document.querySelector('form');
  const delay = 5000;
  const proxy = 'https://cors-anywhere.herokuapp.com/';

  watchers(state);

  const inputHandler = (event) => {
    const { value } = event.target;
    const feedsUrls = state.feeds.map((e) => e.url);

    state.addNewFeed.state = 'filling';
    if (value === '') {
      state.addNewFeed.submitDisabled = true;
      state.userNotification = 'Field shouldn\'t be empty';
    } else if (!isURL(value)) {
      state.addNewFeed.submitDisabled = true;
      state.userNotification = 'Incorrect url';
    } else if (feedsUrls.includes(value)) {
      state.addNewFeed.submitDisabled = true;
      state.userNotification = 'This url has been already added';
    } else {
      state.addNewFeed.submitDisabled = false;
      state.userNotification = '';
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('input');
    state.addNewFeed.state = 'processing';
    state.userNotification = 'Please wait';
    state.addNewFeed.submitDisabled = true;

    axios.get(proxy + url)
      .then((response) => {
        const xmlObj = getDomDoc(response.data);
        const feed = getFeedData(url, xmlObj);
        const news = getNewsData(url, xmlObj);
        state.feeds.unshift(feed);
        state.news.unshift(...news);
        state.addNewFeed.state = 'success';
        state.userNotification = '';
      })
      .catch((error) => {
        console.log(error);
        state.userNotification = 'Something wrong with network or this url is\'nt RSS url. Please check and try to repeate later';
        state.addNewFeed.state = 'fail';
      });
  };

  form.elements.input.addEventListener('input', inputHandler);
  form.addEventListener('submit', submitHandler);

  // let i = 0;

  const updateAllNews = () => {
    state.updateFeedsNews.state = 'waiting';
    const urls = state.feeds.map((e) => e.url);

    const updateUrlNews = (url) => {
      return axios.get(proxy + url)
        .then((response) => {
          state.updateFeedsNews.state = 'processing';
          const xmlObj = getDomDoc(response.data);
          const newNewsUrlData = getNewsData(url, xmlObj);
          const oldNewsData = state.news.filter((e) => e.url === url);
          const diff = getDiff(newNewsUrlData, oldNewsData);
          state.updateFeedsNews.state = 'success';
          // i += 1;
          // if (i > 2) {
          //   throw new Error('test');
          // }
          console.log(diff);
          if (diff.length > 0) {
            state.news.unshift(...diff);
          }
        });
    };
    const promises = urls.map((url) => updateUrlNews(url).catch((error) => {
      console.log(error);
      state.updateFeedsNews.state = 'fail';
      state.addNewFeed.error = 'Somethnig wrong with network';
    }));
    Promise.all(promises);
    setTimeout(updateAllNews, delay);
  };

  setTimeout(updateAllNews, delay);

  $('#exampleModal').on('show.bs.modal', function (event) {
    const modalButton = $(event.relatedTarget);
    const recipient = modalButton.data('whatever');
    const modal = $(this);
    modal.find('.modal-body').text(recipient);
  });
};

export default app;
