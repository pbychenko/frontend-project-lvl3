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
        .then(({ data }) => {
          state.updateFeedsNews.state = 'processing';
          const { news } = parse(url, data);
          const oldNews = state.news.filter((e) => e.url === url);
          const diff = getDiff(news, oldNews);
          if (diff.length > 0) {
            state.news.unshift(...diff);
          }
          state.updateFeedsNews.state = 'success';
        })
        .catch((error) => {
          console.log(error);
          state.updateFeedsNews.state = 'fail';
          // state.userNotification = 'Possible something wrong with network or url isn\'t correct. Please check and try to repeat later';
          state.userNotification = error.message;

        })
    );

    const promises = urls.map((url) => updateFeedNewsByUrl(url));

    Promise.all(promises);
    setTimeout(updateAllNews, delay);
  };

  setTimeout(updateAllNews, delay);
};
