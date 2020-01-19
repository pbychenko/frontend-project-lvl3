import _ from 'lodash';
import axios from 'axios';
import parse from './parsers';

const proxy = 'https://cors-anywhere.herokuapp.com/';

export const addFeed = (globalState, url) => {
  const state = globalState;
  axios.get(proxy + url)
    .then(({ data }) => {
      const { feed, news } = parse(data);
      state.feeds.unshift(feed);
      state.news.unshift(...news);
      state.urls.push(url);
      state.addNewFeed.state = 'success';
      state.userNotification = '';
    })
    .catch((error) => {
      state.userNotification = error.message;
      state.addNewFeed.state = 'fail';
      throw error;
    });
};

export const updateNews = (globalState) => {
  const state = globalState;
  const delay = 5000;

  const updateFeedNewsByUrl = (url) => (
    axios.get(proxy + url)
      .then(({ data }) => {
        state.updateFeedsNews.state = 'processing';
        const { feed, news } = parse(data);
        const oldNews = state.news.filter((e) => e.feedLink === feed.link);
        const diff = _.differenceWith(news, oldNews, _.isEqual);
        if (diff.length > 0) {
          state.news.unshift(...diff);
        }
        state.updateFeedsNews.state = 'success';
      })
      .catch((error) => {
        state.updateFeedsNews.state = 'fail';
        state.userNotification = error.message;
        throw error;
      })
  );

  state.updateFeedsNews.state = 'waiting';
  const promises = state.urls.map((url) => updateFeedNewsByUrl(url));
  Promise.all(promises).finally(() => setTimeout(() => updateNews(state), delay));
};
