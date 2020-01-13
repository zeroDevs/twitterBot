require('dotenv').config();
const twit = require('twit');
const config = require('./config.js');
const client = new twit(config);
const CronJob = require('cron').CronJob;
require('./web/server')(client);

const TweetsService = require('./database/services/tweets.service');

const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DATABASE CONNECTION ESTABLISHED'));

console.log('BOT IS RUNNING');

const stream = client.stream('statuses/filter', { track: '#30DayProject' });
stream.on('tweet', tweet => {
  if (!tweet.text.startsWith('RT @')) {
    TweetsService.saveTweet(tweet);
    console.log('Updating Tweets');
  } else console.log('Tweet is a RT');
});
