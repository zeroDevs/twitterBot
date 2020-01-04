require("dotenv").config();
const twit = require("twit");
const config = require("./config.js");
const client = new twit(config);
const CronJob = require("cron").CronJob;
require("./web/server")(client);

const TweetsService = require("./database/services/tweets.service");

const mongoose = require("mongoose");
mongoose
    .connect(process.env.MONGO_DB, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log("DATABASE CONNECTION ESTABLISHED"));

console.log("BOT IS RUNNING");

new CronJob(
    "0 */10 * * * *",
    function() {
        let params = {
            q: "#30DayProject",
            result_type: "recent",
            lang: "en",
            count: 100
        };

        async function gotTweets(err, data, response) {
            if (!err) {
                await data.statuses.map(tweet => {
                    TweetsService.saveTweet(tweet);
                });
                if (data.statuses.length === 100) {
                    params.max_id = data.statuses[99].id;
                    client.get("search/tweets", params, gotTweets);
                }
            } else console.error(`Something went wrong: `, err);
        }

        client.get("search/tweets", params, gotTweets);
        console.log("Updating Tweets");
    },
    null,
    true,
    "America/Los_Angeles"
);
