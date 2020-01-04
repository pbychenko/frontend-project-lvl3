import axios from 'axios';
import { getFeedData, getNewsData, getDomDoc } from './parsers';
import getDiff from './utils';

const proxy = 'https://cors-anywhere.herokuapp.com/';

export const addFeed = (globalState, url) => {
  const state = globalState;
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

export const updateAllNewsPeriodically = (globalState) => {
  const state = globalState;
  const delay = 5000;

  const updateAllNews = () => {
    state.updateFeedsNews.state = 'waiting';
    const urls = state.feeds.map((e) => e.url);

    const updateFeedNewsByUrl = (url) => (
      axios.get(proxy + url)
        .then((response) => {
          state.updateFeedsNews.state = 'processing';
          const xmlObj = getDomDoc(response.data);
          const newNewsUrlData = getNewsData(url, xmlObj);
          const oldNewsData = state.news.filter((e) => e.url === url);
          const diff = getDiff(newNewsUrlData, oldNewsData);
          state.updateFeedsNews.state = 'success';
          if (diff.length > 0) {
            state.news.unshift(...diff);
          }
        })
        .catch((error) => {
          console.log(error);
          state.updateFeedsNews.state = 'fail';
          state.userNotification = 'Somethnig wrong with network';
        })
    );

    const promises = urls.map((url) => updateFeedNewsByUrl(url));

    Promise.all(promises);
    setTimeout(updateAllNews, delay);
  };

  setTimeout(updateAllNews, delay);
};
