import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import $ from 'jquery';
import isURL from 'validator/lib/isURL';
import watchGlobalState from './watchers';
import { addFeed, updateAllNewsPeriodically } from './requests';
import translate from './localization';

const app = () => {
  const state = {
    addNewFeed: {
      state: '',
      validationState: 'invalid',
    },
    userNotification: '',
    feeds: [],
    news: [],
    updateFeedsNews: {
      state: '',
    },
  };

  const form = document.querySelector('form');

//   function wait(ms){
//     var start = new Date().getTime();
//     var end = start;
//     while(end < start + ms) {
//       end = new Date().getTime();
//    }
//  };

  watchGlobalState(state);
  console.log(translate('key'));

  const inputHandler = (event) => {
    const { value } = event.target;
    const feedsUrls = state.feeds.map((e) => e.url);

    state.addNewFeed.state = 'filling';
    if (value === '') {
      state.addNewFeed.validationState = 'invalid';
      state.userNotification = 'Field shouldn\'t be empty';
    } else if (!isURL(value)) {
      state.addNewFeed.validationState = 'invalid';
      state.userNotification = 'Incorrect url';
    } else if (feedsUrls.includes(value)) {
      state.addNewFeed.validationState = 'invalid';
      state.userNotification = 'This url has been already added';
    } else {
      state.addNewFeed.validationState = 'valid';
      state.userNotification = '';
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('input');
    state.addNewFeed.state = 'processing';
    state.userNotification = 'Please wait';
    state.addNewFeed.validationState = 'invalid';
    addFeed(state, url);
  };

  form.elements.input.addEventListener('input', inputHandler);
  form.addEventListener('submit', submitHandler);
  updateAllNewsPeriodically(state);

  // eslint-disable-next-line func-names
  $('#exampleModal').on('show.bs.modal', function (event) {
    const modalButton = $(event.relatedTarget);
    const recipient = modalButton.data('whatever');
    const modal = $(this);
    modal.find('.modal-body').text(recipient);
  });
};

export default app;
