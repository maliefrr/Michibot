require('dotenv').config();
const Tweet = require('twit');

const Twit = new Tweet({
  consumer_key:         process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
  access_token:         process.env.TWITTER_API_TOKEN,
  access_token_secret:  process.env.TWITTER_API_SECRET,
  timeout_ms:           60*1000,
  strictSSL:            true,
});

function getTweet(tweetId) {
    return new Promise((resolve, reject) => {
        Twit.get('statuses/show/:id', {id: tweetId, tweet_mode: 'extended'}, (err, data) => {
        if(err) {
            return reject(err);
        } else {
            return resolve(data);
        }
        });
    })
}

function parseMedia(status) {
    const caption = status.text || status.full_text;
    const extendedEntities = status.extended_entities;
    let media = [];
    let type = '';
    if(extendedEntities && extendedEntities.media) {
    media = extendedEntities.media.map((obj) => {
        const tmp = {};
        type = obj.type;
        if(obj.type === 'video' || obj.type === 'animated_gif') {
            const videos = obj.video_info.variants;
            // console.log('videos', videos);
            let selectedVideo = videos;
            if (obj.type === 'video') {
            selectedVideo = videos.filter((f) => f.bitrate);
        }
        selectedVideo = selectedVideo.reduce((prev, current) => (prev.bitrate > current.bitrate) ? prev : current);
        tmp.type = obj.type;
        tmp.thumbnail = obj.media_url_https;
        tmp.url = selectedVideo.url;
        } 
        
        if (obj.type === 'photo') {
        tmp.type = obj.type;
        tmp.thumbnail = obj.media_url_https;
        tmp.url = obj.media_url_https;
        }
        return tmp;
        });

        return {
        user: status.user.screen_name,
        caption,
        url: `https://twitter.com/${status.user.screen_name}/status/${status.id_str}`,
        type,
        media
        }
    }
    return false;
}

const getStatusID = (url) => {
    try {
        url = new URL(url);
        const parseUrl = url.pathname.split('/');
    // console.log('parseUrl',parseUrl);
        if (url.pathname && parseUrl.length > 2) {
        return parseUrl[3].toString();
    } return null;
    } catch (error) {
    return null;
    }
}

module.exports = {
    Twit,
    getTweet,
    parseMedia,
    getStatusID
};