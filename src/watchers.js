import { watch } from 'melanke-watchjs';
import { renderNotification, renderFeeds, renderAllItems } from './renders';

const watchGlobalState = (state) => {
  const input = document.querySelector('#input-rss');
  const button = document.querySelector('#add-rss');
  const errorBlock = document.querySelector('[name="errors"]');

  watch(state, 'addNewFeed', () => {
    button.disabled = state.addNewFeed.validationState === 'invalid';
    switch (state.addNewFeed.state) {
      case 'filling':
        break;
      case 'processing':
        input.value = '';
        input.disabled = true;
        break;
      case 'success':
        input.disabled = false;
        renderFeeds(state.feeds, state.items);
        break;
      case 'fail':
        input.disabled = false;
        break;
      default:
        throw Error('Incorrect addNewFeed state occurs!');
    }
  });

  watch(state, 'updateFeedsItems', () => {
    switch (state.updateFeedsItems.state) {
      case 'waiting':
        break;
      case 'processing':
        break;
      case 'success':
        renderAllItems(state.feeds, state.items);
        break;
      case 'fail':
        break;
      default:
        throw Error('incorrect updateFeedsItems state occurs!');
    }
  });

  watch(state, 'userNotification', () => {
    errorBlock.innerHTML = renderNotification(state.userNotification);
  });
};

export default watchGlobalState;
