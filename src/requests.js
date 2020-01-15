import axios from 'axios';
import parse from './parsers';

const proxy = 'https://cors-anywhere.herokuapp.com/';

const getDiff = (data1, data2) => {
  const data2Titles = data2.map((el) => el.title);
  return data1.filter((el) => !data2Titles.includes(el.title));
};

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
        const { news } = parse(url, data);
        const oldNews = state.news.filter((e) => e.url === url);
        const diff = getDiff(news, oldNews);
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
  const urls = state.feeds.map((e) => e.url);
  const promises = urls.map((url) => updateFeedNewsByUrl(url));
  Promise.all(promises).finally(() => setTimeout(() => updateNews(state), delay));
};
