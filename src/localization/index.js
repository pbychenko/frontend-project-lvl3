import i18next from 'i18next';
import en from './en';

const translate = (f) => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en,
    },
  }).then((t) => f(t));
};

export default translate;
