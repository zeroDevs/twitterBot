const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const PORT = process.env.PORT || 3000;
const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
module.exports = client => {
    app.set("client", client);
};

const TweetsService = require("../database/services/tweets.service");

app.get("/", function(req, res) {
    res.render("home", {
        pageTitle: "Welcome to tweetZero"
    });
});

app.get("/30dayproject", async function(req, res) {
    const rt = req.query.retweet === undefined ? false : req.query.retweet;
    const filter = {
        text: rt ? "Show Only Original Tweets" : "Show Only Retweets",
        link: rt ? "/30dayproject" : "/30dayproject?retweet=true"
    };
    const tweets = await TweetsService.displayTweets(rt);
    res.render("30day", {
        pageTitle: "#30DayProject Stream",
        tweets: tweets,
        filterText: filter.text,
        filterLink: filter.link
    });
});

app.get("/30dayproject/:user", async function(req, res) {
    const user = req.params.user;
    const tweets = await TweetsService.displayUsersTweets(user);

    res.render("30day", { pageTitle: `${user}'s Tweets`, tweets: tweets });
});

// app.get("/gettweets", function(req, res) {

//     const client = req.app.get("client");

//     let params = {
//         q: "#30DayProject",
//         result_type: "recent",
//         lang: "en",
//         count: 100
//     };

//     async function gotTweets(err, data, response) {
//         if (!err) {
//             await data.statuses.map(tweet => {
//                 TweetsService.saveTweet(tweet);
//             });
//             if (data.statuses.length === 100) {
//                 params.max_id = data.statuses[99].id;
//                 client.get("search/tweets", params, gotTweets);
//             }
//         } else console.error(`Something went wrong: `, err);
//     }

//     client.get("search/tweets", params, gotTweets);
//     res.send("Updating Database! You can now return to the results page.");
// });

app.use(express.static(path.join(__dirname, "/public")));
app.listen(PORT, () => {
    console.log(`tweetZero server is running on port: ${PORT}`);
});
