'use strict';

exports.port = process.env.PORT || 5000;
exports.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || process.env.MONGOLAB_AMBER_URI || 'mongodb://motosa:motosa@ds115071.mlab.com:15071/recruiter-backup'
};
exports.companyName = 'Talent Connect';
exports.projectName = 'Talent Connect';
exports.systemEmail = 'banji.oguntade@gmail.com';
exports.cryptoKey = 'k3yb0ardc4t';
exports.loginAttempts = {
  forIp: 50,
  forIpAndUser: 7,
  logExpiration: '20m'
};
exports.requireAccountVerification = false;
exports.smtp = {
  from: {
    name: process.env.SMTP_FROM_NAME || exports.projectName +' recruit-io',
    address: process.env.SMTP_FROM_ADDRESS || 'd60fbc3f76-e7652e@inbox.mailtrap.io'
  },
  credentials: {
    user: process.env.SMTP_USERNAME || '540d5304d701e3',
    password: process.env.SMTP_PASSWORD || '7db9fbee74f669',
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    ssl: true
  }
};
exports.oauth = {
  twitter: {
    key: process.env.TWITTER_OAUTH_KEY || '',
    secret: process.env.TWITTER_OAUTH_SECRET || ''
  },
  facebook: {
    key: process.env.FACEBOOK_OAUTH_KEY || '',
    secret: process.env.FACEBOOK_OAUTH_SECRET || ''
  },
  github: {
    key: process.env.GITHUB_OAUTH_KEY || '',
    secret: process.env.GITHUB_OAUTH_SECRET || ''
  },
  google: {
    key: process.env.GOOGLE_OAUTH_KEY || '',
    secret: process.env.GOOGLE_OAUTH_SECRET || ''
  },
  tumblr: {
    key: process.env.TUMBLR_OAUTH_KEY || '',
    secret: process.env.TUMBLR_OAUTH_SECRET || ''
  }
};
