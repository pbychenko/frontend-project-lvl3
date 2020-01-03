import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import $ from 'jquery';
import isURL from 'validator/lib/isURL';
import watchers from './watchers';
import { addFeed, updateAllNewsPeriodically } from './requests';

const app = () => {
  const state = {
    addNewFeed: {
      state: '',
      submitDisabled: true,
    },
    userNotification: '',
    feeds: [],
    news: [],
    updateFeedsNews: {
      state: '',
    },
  };

  const form = document.querySelector('form');

  watchers(state);

  const inputHandler = (event) => {
    const { value } = event.target;
    const feedsUrls = state.feeds.map((e) => e.url);

    state.addNewFeed.state = 'filling';
    if (value === '') {
      state.addNewFeed.submitDisabled = true;
      state.userNotification = 'Field shouldn\'t be empty';
    } else if (!isURL(value)) {
      state.addNewFeed.submitDisabled = true;
      state.userNotification = 'Incorrect url';
    } else if (feedsUrls.includes(value)) {
      state.addNewFeed.submitDisabled = true;
      state.userNotification = 'This url has been already added';
    } else {
      state.addNewFeed.submitDisabled = false;
      state.userNotification = '';
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('input');
    state.addNewFeed.state = 'processing';
    state.userNotification = 'Please wait';
    state.addNewFeed.submitDisabled = true;
    addFeed(state, url);
  };

  form.elements.input.addEventListener('input', inputHandler);
  form.addEventListener('submit', submitHandler);
  updateAllNewsPeriodically(state);

  $('#exampleModal').on('show.bs.modal', function (event) {
    const modalButton = $(event.relatedTarget);
    const recipient = modalButton.data('whatever');
    const modal = $(this);
    modal.find('.modal-body').text(recipient);
  });
};

export default app;
