export const featureToggles = (key: 'articles' | string): boolean => {
  switch (key) {
    case 'articles':
      return DEV_ENV || TEST_ENV;
    default:
      return false;
  }
};

export const DEV_ENV = process.env.NODE_ENV === 'development';
export const TEST_ENV = window.location.host === 'www.test.fagord.no';
