const Tweets = require("../models/tweets.model");

class TweetsService {
    async displayTweets(rt) {
        const filter = rt
            ? { "tweet_details.tweetText": /^RT.*/ }
            : { "tweet_details.tweetText": { $not: /^RT.*/ } };
        try {
            const tweets = await Tweets.find(filter).sort({
                "tweet_details.created_at": -1
            });
            return tweets;
        } catch (error) {
            console.log(`*displayTweets*: ${error}`);
        }
    }

    async displayUsersTweets(username) {
        try {
            const tweets = await Tweets.find({
                "user_details.screen_name": username
            }).sort({ "tweet_details.created_at": -1 });
            return tweets;
        } catch (error) {
            console.log(`*displayUsersTweets*: ${error}`);
        }
    }

    async saveTweet(tweetObj) {
        try {
            const tweet = await Tweets.findOne({
                "tweet_details.id_str": tweetObj.id_str
            });

            if (!tweet) {
                const slicedDate = tweetObj.created_at.split(" ");

                const newTweet = await new Tweets({
                    user_details: {
                        id: tweetObj.user.id,
                        name: tweetObj.user.name,
                        screen_name: tweetObj.user.screen_name,
                        avatar_url: tweetObj.user.profile_image_url_https.replace(
                            "normal",
                            "bigger"
                        ),
                        location: tweetObj.user.location,
                        desc: tweetObj.user.description,
                        url: tweetObj.user.url,
                        followers_count: tweetObj.user.followers_count,
                        statuses_count: tweetObj.user.statuses_count,
                        joined_twitter: tweetObj.user.created_at,
                        profile_background_color:
                            tweetObj.user.profile_background_color,
                        profile_banner_url: tweetObj.user.profile_banner_url
                            ? tweetObj.user.profile_banner_url
                            : "http://presskitchen.com/wp-content/uploads/2019/08/OTB_Company_Blue.png.img_.fullhd.medium-1.png"
                    },
                    tweet_details: {
                        created_at: `${slicedDate[1]}-${slicedDate[2]}-${slicedDate[5]} ${slicedDate[3]}`,
                        id: tweetObj.id,
                        id_str: tweetObj.id_str,
                        tweetText: tweetObj.text,
                        hashtags: tweetObj.entities.hashtags,
                        symbols: tweetObj.entities.symbols,
                        user_mentions: tweetObj.entities.user_mentions,
                        retweet_count: tweetObj.retweet_count,
                        favorite_count: tweetObj.favorite_count
                    }
                });
                newTweet.save();
            }
        } catch (error) {
            console.log(`*saveTweet*: ${error}`);
        }
    }
}

module.exports = new TweetsService();
