import { watch } from 'melanke-watchjs';
import { renderErrors, renderFeeds, renderAllNews } from './renders';

const watchers = (state) => {
  const button = document.querySelector('#add-rss');
  const errorBlock = document.querySelector('[name="errors"]');

  watch(state, 'addNewFeed', () => {
    button.disabled = state.addNewFeed.submitDisabled;
    errorBlock.innerHTML = renderErrors(state.addNewFeed.error);
  });

  watch(state, 'feeds', () => {
    renderFeeds(state.feeds, state.news);
  });

  watch(state, 'news', () => {
    renderAllNews(state.feeds, state.news);
  });
};

export default watchers;
