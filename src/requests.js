import _ from 'lodash';
import axios from 'axios';
import parse from './parsers';

const proxy = 'https://cors-anywhere.herokuapp.com/';

export const addFeed = (globalState, url) => {
  const state = globalState;
  axios.get(proxy + url)
    .then(({ data }) => {
      const { feed, items } = parse(data);
      state.feeds.unshift(feed);
      state.items.unshift(...items);
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

export const updateItems = (globalState) => {
  const state = globalState;
  const delay = 5000;

  const updateFeedItems = (url) => (
    axios.get(proxy + url)
      .then(({ data }) => {
        state.updateFeedsItems.state = 'processing';
        const { feed, items } = parse(data);
        const oldItems = state.items.filter((e) => e.feedLink === feed.link);
        const diff = _.differenceWith(items, oldItems, _.isEqual);
        if (diff.length > 0) {
          state.items.unshift(...diff);
        }
        state.updateFeedsItems.state = 'success';
      })
      .catch((error) => {
        state.updateFeedsItems.state = 'fail';
        state.userNotification = error.message;
        throw error;
      })
  );

  state.updateFeedsItems.state = 'waiting';
  const promises = state.urls.map((url) => updateFeedItems(url));
  Promise.all(promises).finally(() => setTimeout(() => updateItems(state), delay));
};
