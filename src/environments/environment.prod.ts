import { SLACK_WEBHOOK, SENTRY_KEY } from './environment.staging';

export const environment = {
  production: true,
  // appUrl: 'http://localhost:3000', // for testing
  // appUrl: 'https://the-newsroom-mean-app.herokuapp.com/',
  appUrl: 'https://thenewsroom-mean-app.appspot.com/',
  apiUrl: 'https://the-newsroom-mean-app.herokuapp.com/api',
  // put your webhook url here (SLACK_WEBHOOK:'https://hooks.slack.com/services/********************************************')
  SLACK_WEBHOOK: SLACK_WEBHOOK,
  // put your sentry url here (SENTRY_KEY:'https://************************** */@sentry.io/*******/')
  SENTRY_KEY: SENTRY_KEY,
};
