import i18next from 'i18next';
import en from './en';

const init = i18next.init({
  lng: 'en',
  debug: true,
  resources: {
    en,
  },
});

const translate = (e) => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en,
    },
  });
  
  return i18next.t(e);
};

export default translate;
