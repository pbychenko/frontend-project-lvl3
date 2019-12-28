import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import $ from 'jquery';
import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import parse from './parser';
import validate from './validator';
import { renderErrors, render } from './renders';
import { getDiff } from './utils';

const app = () => {
  const state = {
    addUrlProcess: {
      error: '',
      submitDisabled: true,
    },
    feeds: [],
  };

  const input = document.querySelector('#input-rss');
  const button = document.querySelector('#add-rss');
  const form = document.querySelector('form');
  const errorBlock = document.querySelector('[name="errors"]');
  const delay = 5000;
  const proxy = 'https://cors-anywhere.herokuapp.com/';

  watch(state, 'addUrlProcess', () => {
    button.disabled = state.addUrlProcess.submitDisabled;
    errorBlock.innerHTML = renderErrors(state.addUrlProcess.error);
  });

  watch(state, 'feeds', () => {
    // const feed = state.feeds[state.feeds.length - 1];
    // render(feed);
    render(state.feeds);
  });

  form.elements.rss.addEventListener('keyup', () => {
    const feedsUrls = state.feeds.map((e) => e.url);
    state.addUrlProcess.error = '';
    if (input.value === '') {
      state.addUrlProcess.submitDisabled = true;
      state.addUrlProcess.error = 'Field is empty, please enter rss url';
    } else if (!isURL(input.value)) {
      state.addUrlProcess.submitDisabled = true;
      state.addUrlProcess.error = 'Incorrect url';
    } else if (feedsUrls.includes(input.value)) {
      state.addUrlProcess.submitDisabled = true;
      state.addUrlProcess.error = 'This url has been already added';
    } else {
      state.addUrlProcess.submitDisabled = false;
      state.addUrlProcess.error = '';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // const formData = new FormData(e.target);
    const url = input.value;
    // const proxy = 'https://cors-anywhere.herokuapp.com/';
    axios.get(proxy + url)
      .then((response) => {
        const xmlObj = parse(response.data);
        const data = validate(xmlObj);
        // console.log(data.items);
        state.feeds.push({ url, data });
      })
      .catch((error) => {
        console.log(error);
        state.addUrlProcess.error = 'Somethnig wrong with network, please try to repeate later';
      });
    input.value = '';
  });

  const updateNews = () => {
    const urls = state.feeds.map((e, i) => ({ url: e.url, index: i }));
    // console.log(urls);
    urls.forEach((url) => {
      axios.get(proxy + url.url)
        .then((response) => {
          const xmlObj = parse(response.data);
          const newData = validate(xmlObj).items;
          console.log(newData);
          const oldData = state.feeds[url.index].data.items;
          // console.log(oldData);
          // console.log(getDiff(newData, oldData));
          const diff = getDiff(newData, oldData);
          console.log(diff);
          if (diff.length > 0) {
            // console.log(state.feeds[url.index].data.items);
            state.feeds[url.index].data.items.push(...diff);
          }
        })
        .catch((error) => {
          console.log(error);
          state.addUrlProcess.error = 'Somethnig wrong with network, please try to repeate later';
        });
    });
    setTimeout(updateNews, delay);
  };

  setTimeout(updateNews, delay);

  $('#exampleModal').on('show.bs.modal', function (event) {
    const modalButton = $(event.relatedTarget);
    const recipient = modalButton.data('whatever');
    const modal = $(this);
    modal.find('.modal-body').text(recipient);
  });
};

export default app;
