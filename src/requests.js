import axios from 'axios';
import parse from './parsers';
import getDiff from './utils';

const proxy = 'https://cors-anywhere.herokuapp.com/';

export const addFeed = (globalState, url) => {
  const state = globalState;
  axios.get(proxy + url)
    .then(({ data }) => {
      const { feed, news } = parse(url, data);
      state.feeds.unshift(feed);
      state.news.unshift(...news);
      state.addNewFeed.state = 'success';
      state.userNotification = '';
    })
    .catch((error) => {
      console.log(error);
      // state.userNotification = 'Possible something wrong with network or url isn\'t correct. Please check and try to repeat later';
      state.userNotification = error.message;
      state.addNewFeed.state = 'fail';
      // if (error.response) {
      //   console.log('ya tu');
      //   state.userNotification = 'Server doesn't';
      //   // The request was made and the server responded with a status code
      //   // that falls out of the range of 2xx
      //   console.log(error.response.data);
      //   console.log(error.response.status);
      //   console.log(error.response.headers);
      // } else if (error.request) {
      //   // The request was made but no response was received
      //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      //   // http.ClientRequest in node.js
      //   console.log(error.request);
      // } else {
      //   // Something happened in setting up the request that triggered an Error
      //   console.log('Error', error.message);
        
      // }
      // console.log(error.config);
    });
};

export const updateAllNewsPeriodically = (globalState) => {
  const state = globalState;
  const delay = 5000;

  const updateFeedNewsByUrl = (url) => (
    axios.get(proxy + url)
      .then(({ data }) => {
        state.updateFeedsNews.state = 'processing';
        if (url === 'https://fc-arsenal.com/rss') {
          throw new Error('test');
        }
        const { news } = parse(url, data);
        const oldNews = state.news.filter((e) => e.url === url);
        const diff = getDiff(news, oldNews);
        if (diff.length > 0) {
          state.news.unshift(...diff);
        }
        state.updateFeedsNews.state = 'success';
        console.log(url);
      })
      .catch((error) => {
        console.log(error);
        state.updateFeedsNews.state = 'fail';
        // state.userNotification = 'Possible something wrong with network or url isn\'t correct. Please check and try to repeat later';
        state.userNotification = error.message;
      })
  );

  state.updateFeedsNews.state = 'waiting';
  const urls = state.feeds.map((e) => e.url);
  const promises = urls.map((url) => updateFeedNewsByUrl(url));
  Promise.all(promises).finally(() => setTimeout(() => updateAllNewsPeriodically(state), delay));
};
