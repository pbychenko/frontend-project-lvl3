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
      state: '', //filling, processing, processed, failed
      error: '',
      submitDisabled: true,
    },
    feeds: [],
    news: [],
    updateFeedsNews: {
      state: '', //waiting, inProgress, success, fail
      errors: [],
    },
  };

  const form = document.querySelector('form');
  const delay = 5000;
  const proxy = 'https://cors-anywhere.herokuapp.com/';

  watchers(state);

  form.elements.rss.addEventListener('keyup', (event) => {
    const feedsUrls = state.feeds.map((e) => e.url);
    state.addNewFeed.error = '';
    const { value } = event.target;

    if (state.addNewFeed.state === 'processing') {
      state.addNewFeed.submitDisabled = true;
    } else if (value === '') {
      state.addNewFeed.state = 'filling';
      state.addNewFeed.submitDisabled = true;
    } else if (!isURL(value)) {
      state.addNewFeed.submitDisabled = true;
      state.addNewFeed.state = 'filling';
      state.addNewFeed.error = 'Incorrect url';
    } else if (feedsUrls.includes(value)) {
      state.addNewFeed.state = 'filling';
      state.addNewFeed.submitDisabled = true;
      state.addNewFeed.error = 'This url has been already added';
    } else {
      state.addNewFeed.state = 'filling';
      state.addNewFeed.submitDisabled = false;
      state.addNewFeed.error = '';
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('rss');
    state.addNewFeed.state = 'processing';
    state.addNewFeed.submitDisabled = true;

    axios.get(proxy + url)
      .then((response) => {
        const xmlObj = getDomDoc(response.data);
        const feed = getFeedData(url, xmlObj);
        const news = getNewsData(url, xmlObj);
        state.addNewFeed.state = 'processed';
        state.feeds.unshift(feed);
        state.news.unshift(...news);
      })
      .catch((error) => {
        console.log(error);
        state.addNewFeed.error = 'Somethnig wrong with network or this url is\'nt RSS url. Please check and try to repeate later';
        state.addNewFeed.state = 'failed';
      });
  });

  const updateAllNews = () => {
    const urls = state.feeds.map((e) => e.url);

    const updateUrlNews = (url) => {
      return axios.get(proxy + url)
        .then((response) => {
          const xmlObj = getDomDoc(response.data);
          const newNewsUrlData = getNewsData(url, xmlObj);
          const oldNewsData = state.news.filter((e) => e.url === url);
          const diff = getDiff(newNewsUrlData, oldNewsData);
          console.log(diff);
          if (diff.length > 0) {
            state.news.unshift(...diff);
          }
        });
    };
    const promises = urls.map((url) => updateUrlNews(url).catch((error) => {
      console.log(error);
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
