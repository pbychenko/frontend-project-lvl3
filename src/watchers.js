import { watch } from 'melanke-watchjs';
import { renderNotification, renderFeeds, renderAllNews } from './renders';

const watchers = (state) => {
  const input = document.querySelector('#input-rss');
  const button = document.querySelector('#add-rss');
  const errorBlock = document.querySelector('[name="errors"]');

  watch(state, 'addNewFeed', () => {
    button.disabled = state.addNewFeed.submitDisabled;
    switch (state.addNewFeed.state) {
      case 'filling':
        break;
      case 'processing':
        input.value = '';
        input.disabled = true;
        break;
      case 'success':
        input.disabled = false;
        renderFeeds(state.feeds, state.news);
        break;
      case 'fail':
        input.disabled = false;
        break;
      default:
        throw Error('Incorrect addNewFeed state occurs!');
    }
  });

  watch(state, 'updateFeedsNews', () => {
    switch (state.updateFeedsNews.state) {
      case 'waiting':
        break;
      case 'processing':
        break;
      case 'success':
        renderAllNews(state.feeds, state.news);
        break;
      case 'fail':
        break;
      default:
        throw Error('incorrect updateFeedsNews state occurs!');
    }
  });

  watch(state, 'userNotification', () => {
    errorBlock.innerHTML = renderNotification(state.userNotification);
  });
};

export default watchers;
