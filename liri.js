require("dotenv").config();
let keys = require("./keys.js");
let Spotify = require("node-spotify-api");
let spotify = new Spotify({
    id: "84e1a75396374dc9af5de9b596783587", //until I get .env to work =(
    secret: "95d42d78d16645748538c52f900a0b17"
});
let request = require("request");
let moment = require("moment");
let fs = require('fs');
let args = process.argv.splice(2);
let userCommand = args[0];
let userInput = args[1];

switch (userCommand) {
    case "spotify-this-song":
        getSpotify();
        break;
    case "movie-this":
        getMovie();
        break;
    case "concert-this":
        getConcert();
        break;
    case "do-what-it-says":
        doThis();
        break;
};

function getSpotify() {
    if (!userInput) {
        userInput = "Mr. Brightside";
    }
    spotify.search({
        type: 'track',
        query: userInput
    }, function (err, response) {
        var spotifyResponse = response.tracks.items
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            console.log(`
            Artist: ${JSON.stringify(spotifyResponse[0].album.artists[0].name)}
            Song: ${userInput}
                `);
        }
    });
}

function getMovie() {
    let movieUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";
    request(movieUrl, function (err, response, body) {
        if (userInput === undefined) {
            userInput = "Mr. Nobody";
            console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/ It's on Netflix!");
        }
        if (err) {
            console.log(" Error: " + err);
            return;
        } else if (response.statusCode === 200) {

            let jsonMovie = JSON.parse(body);
            console.log(`
            Movie Title: ${jsonMovie.Title}
            Year: ${jsonMovie.Year}
            IMDB Rating: ${jsonMovie.imdbRating}
            Rotten Tomatoes Rating: ${jsonMovie.Ratings[1].Value}
            Country: ${jsonMovie.Country}
            Language: ${jsonMovie.Language}
            Plot: ${jsonMovie.Plot}
            Actors: ${jsonMovie.Actors}    
            `);
        }
    })
}

function getConcert() {
    let concertUrl = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp";
    request(concertUrl, function (err, response, body) {
        if (userInput === undefined) {
            console.log("Try a different band!");
            return;
        }
        if (err) {
            console.log(" Error: " + err);
            return;
        } else if (response.statusCode === 200) {
            let jsonConcert = JSON.parse(body);
            for (let i = 0; i < jsonConcert.length; i++) {
                console.log(`
            Venue: ${jsonConcert[i].venue.name}
            City Location: ${jsonConcert[i].venue.city}
            Date: ${moment(jsonConcert[i].datetime).format("MM/DD/YY")}
            `);
            }
        }
    })
}

function doThis() {
    fs.readFile("random.txt", "utf8", function (err, data) {
            if (err) {
                console.log(err);
                return;
            } else {
                userCommand = data.split(",")[0];
                userInput = data.split(",")[1];
                console.log(userCommand)
                console.log(userInput);
            }
        }
    )}