import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import $ from 'jquery';
import isURL from 'validator/lib/isURL';
import watchGlobalState from './watchers';
import { addFeed, updateNews } from './requests';
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
    urls: [],
    updateFeedsNews: {
      state: '',
    },
  };

  const form = document.querySelector('form');

  watchGlobalState(state);

  const inputHandler = (event) => {
    const { value } = event.target;

    state.addNewFeed.state = 'filling';
    if (value === '') {
      state.addNewFeed.validationState = 'invalid';
      translate((t) => {
        state.userNotification = t('validationUrlNotifications.emptyField');
      });
    } else if (!isURL(value)) {
      state.addNewFeed.validationState = 'invalid';
      translate((t) => {
        state.userNotification = t('validationUrlNotifications.incorrectUrl');
      });
    } else if (state.urls.includes(value)) {
      state.addNewFeed.validationState = 'invalid';
      translate((t) => {
        state.userNotification = t('validationUrlNotifications.dublicateUrl');
      });
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
  updateNews(state);

  // eslint-disable-next-line func-names
  $('#exampleModal').on('show.bs.modal', function (event) {
    const modalButton = $(event.relatedTarget);
    const recipient = modalButton.data('whatever');
    const modal = $(this);
    modal.find('.modal-body').text(recipient);
  });
};

export default app;
