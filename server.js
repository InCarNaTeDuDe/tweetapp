const express = require('express'),
    app = express(),
    path = require('path');
Twit = require('twit')
T = new Twit({
    consumer_key: '0XG5299e6oSESyHvLGIMGmwW3',
    consumer_secret: 'kh08Sydpo5hYYr0DCY8i7oJRAbxNkI1NKNpdStVi08ICIwBUOW',
    access_token: '3097151617-91Ayf0gu7O81oe6ae3quLPX5cxYkf7pZlkNZ09h',
    access_token_secret: 'TPnK7IgPW0TB0m9NemXiyKAlZC6rBRpqi56w7sDhVxEgl',
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
});

// app.get('/', (req, res) => {
//     res.send("hello world!");
// });

if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        //express middleware to serve the static files ,so that the client can download it form the server
        // res.send("hello world!");
        app.use(express.static(path.join(__dirname, 'client/build')));
    });
}

app.get('/tweets', (req, res) => {
    T.get('search/tweets', { q: req.query.searchTerm, count: 10 }, (err, data, response) => {
        var tweets = data.statuses||[];
        var resultSet = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        for (var i = tweets.length - 1; i >= 0; i--) {
            resultSet.push(
                {
                    profilePic: tweets[i].user.profile_image_url,
                    username: tweets[i].user.screen_name,
                    name: tweets[i].user.name,
                    text: tweets[i].text,
                    verified: tweets[i].verified,
                    created: monthNames[new Date(tweets[i].created_at).getMonth()] + " " + new Date(tweets[i].created_at).getDate(),
                    url: `https://twitter.com/${tweets[i].user.screen_name}`
                }
            );
        }
        // doStream(req.query.searchTerm);
        res.send(resultSet);
    });
});

app.get('/newtweets', (req, res) => {
    let stream = T.stream('statuses/filter', { track: req.query.name, language: 'en' });
    let newData = [];
    stream.on('tweet', (newTweet) => {
        console.log("Arguments",arguments)
        newData.push(newTweet);
        res.send(newData);
    });
});

//filter the public strem which contains specific keyword in English language
// function doStream(keyword) {
//     let stream = T.stream('statuses/filter', { track: keyword, language: 'en' });
//     stream.on('tweet', (newTweet) => {
//         console.log("--New Tweet Came up!", newTweet);
//     });
// }


app.listen(process.env.PORT || 5555, () => console.log(`Server is listening on port ${process.env.PORT}`));