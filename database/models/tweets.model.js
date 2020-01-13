const mongoose = require('mongoose');

const TweetsSchema = new mongoose.Schema({
  user_details: {
    id: Number,
    name: String,
    screen_name: String,
    avatar_url: String,
    location: String,
    desc: String,
    url: String,
    followers_count: Number,
    joined_twitter: String,
    statuses_count: Number,
    profile_background_color: String,
    profile_banner_url: String,
  },
  tweet_details: {
    created_at: String,
    id: Number,
    id_str: String,
    tweetText: String,
    hashtags: Array,
    symbols: Array,
    user_mentions: Array,
    retweet_count: Number,
    favorite_count: Number,
  },
});

module.exports = mongoose.model('Stream-Tweets', TweetsSchema);
