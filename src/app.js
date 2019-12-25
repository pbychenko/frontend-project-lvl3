import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import parse from './parser';
import validate from './validator';

const app = () => {
  const state = {
    addUrlProcess: {
      errors: [],
      submitDisabled: true,
    },
    feeds: [],
  };

  const input = document.querySelector('#input-rss');
  const button = document.querySelector('#add-rss');
  const form = document.querySelector('form');
  const errorBlock = document.querySelector('p');
  const feedList = document.querySelector('.feeds');
  const newsList = document.querySelector('.news');
  // const testFeed = '<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0"><channel><title><![CDATA[Lorem ipsum feed for an interval of 1 minutes]]></title><description><![CDATA[This is a constantly updating lorem ipsum feed]]></description><link>http://example.com/</link><generator>RSS for Node</generator><lastBuildDate>Tue, 24 Dec 2019 03:42:08 GMT</lastBuildDate><pubDate>Tue, 24 Dec 2019 03:42:00 GMT</pubDate><copyright><![CDATA[Michael Bertolacci, licensed under a Creative Commons Attribution 3.0 Unported License.]]></copyright><ttl>1</ttl><item><title><![CDATA[Lorem ipsum 2019-12-24T03:42:00Z]]></title><description><![CDATA[Elit fugiat mollit adipisicing non esse quis esse duis.]]></description><link>http://example.com/test/1577158920</link><guid isPermaLink="true">http://example.com/test/1577158920</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Tue, 24 Dec 2019 03:42:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-12-24T03:41:00Z]]></title><description><![CDATA[Voluptate laboris ea duis laboris dolor eiusmod anim veniam dolore voluptate velit sint consequat.]]></description><link>http://example.com/test/1577158860</link><guid isPermaLink="true">http://example.com/test/1577158860</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Tue, 24 Dec 2019 03:41:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-12-24T03:40:00Z]]></title><description><![CDATA[Adipisicing ad irure sit qui enim deserunt voluptate.]]></description><link>http://example.com/test/1577158800</link><guid isPermaLink="true">http://example.com/test/1577158800</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Tue, 24 Dec 2019 03:40:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-12-24T03:39:00Z]]></title><description><![CDATA[Dolore velit consectetur aliquip ex occaecat quis commodo veniam.]]></description><link>http://example.com/test/1577158740</link><guid isPermaLink="true">http://example.com/test/1577158740</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Tue, 24 Dec 2019 03:39:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-12-24T03:38:00Z]]></title><description><![CDATA[Mollit id sint in cillum amet proident irure commodo commodo laboris nostrud consequat et sunt.]]></description><link>http://example.com/test/1577158680</link><guid isPermaLink="true">http://example.com/test/1577158680</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Tue, 24 Dec 2019 03:38:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-12-24T03:37:00Z]]></title><description><![CDATA[Deserunt sint magna id ullamco aliquip do officia.]]></description><link>http://example.com/test/1577158620</link><guid isPermaLink="true">http://example.com/test/1577158620</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Tue, 24 Dec 2019 03:37:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-12-24T03:36:00Z]]></title><description><![CDATA[Sunt excepteur quis deserunt ut amet in aliqua exercitation exercitation commodo qui.]]></description><link>http://example.com/test/1577158560</link><guid isPermaLink="true">http://example.com/test/1577158560</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Tue, 24 Dec 2019 03:36:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-12-24T03:35:00Z]]></title><description><![CDATA[Reprehenderit magna officia dolor cupidatat nulla cillum incididunt enim consectetur velit.]]></description><link>http://example.com/test/1577158500</link><guid isPermaLink="true">http://example.com/test/1577158500</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Tue, 24 Dec 2019 03:35:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-12-24T03:34:00Z]]></title><description><![CDATA[Voluptate nisi voluptate culpa dolore nisi ex nulla.]]></description><link>http://example.com/test/1577158440</link><guid isPermaLink="true">http://example.com/test/1577158440</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Tue, 24 Dec 2019 03:34:00 GMT</pubDate></item><item><title><![CDATA[Lorem ipsum 2019-12-24T03:33:00Z]]></title><description><![CDATA[Fugiat in et sint aute incididunt enim sunt non aute nisi reprehenderit exercitation.]]></description><link>http://example.com/test/1577158380</link><guid isPermaLink="true">http://example.com/test/1577158380</guid><dc:creator><![CDATA[John Smith]]></dc:creator><pubDate>Tue, 24 Dec 2019 03:33:00 GMT</pubDate></item></channel></rss>';

  watch(state, 'addUrlProcess', () => {
    button.disabled = state.addUrlProcess.submitDisabled;
    errorBlock.innerHTML = state.addUrlProcess.errors.join(', ');
  });

  watch(state, 'feeds', () => {
    const feed = state.feeds[state.feeds.length - 1];
    // state.feeds.forEach((feed) => {
    const feedli = document.createElement('li');
    const feeda1 = document.createElement('a');
    const feedp2 = document.createElement('p');

    feedli.classList.add('list-group-item');
    feeda1.textContent = feed.data.title;
    feeda1.href = feed.data.link;

    feedp2.textContent = feed.data.description;
    feedli.append(feeda1);
    feedli.append(feedp2);
    feedList.append(feedli);

    feed.data.items.forEach((item) => {
      const newli = document.createElement('li');
      const newa1 = document.createElement('a');
      const newp2 = document.createElement('p');

      newli.classList.add('list-group-item');
      newa1.textContent = item.title;
      newa1.href = item.link;
      newp2.textContent = item.description;

      newli.append(newa1);
      newli.append(newp2);
      newsList.append(newli);
    });
  });

  form.elements.rss.addEventListener('keyup', () => {
    const feedsUrls = state.feeds.map((e) => e.url);
    state.addUrlProcess.errors = [];
    if (input.value === '') {
      state.addUrlProcess.submitDisabled = true;
      state.addUrlProcess.errors.push('Field is empty, please enter rss url');
    } else if (!isURL(input.value)) {
      state.addUrlProcess.submitDisabled = true;
      state.addUrlProcess.errors.push('Incorrect url');
    } else if (feedsUrls.includes(input.value)) {
      state.addUrlProcess.submitDisabled = true;
      state.addUrlProcess.errors.push('This url has been already added');
    } else {
      state.addUrlProcess.submitDisabled = false;
      state.addUrlProcess.errors = [];
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // const formData = new FormData(e.target);
    // const formData1 = new FormData(e.target);
    const url = input.value;
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    axios.get(proxy + url).then((response) => {
      // console.log(response.status);
      const xmlObj = parse(response.data);
      const data = validate(xmlObj);
      state.feeds.push({ url, data });
      // state.feeds.push(validate(xmlObj));
      // console.log(state.feeds);
    });
    input.value = '';
  });
};

export default app;
