const fetch = require("node-fetch");
const CryptoJS = require("crypto-js");
const dbo = require('../databaseOps');
const PASS = process.env['PASSWORD'];
const SPOTID = process.env['SPOTIFY ID']
const SPOTSECRET = process.env['SPOTIFY SECRET']


async function sendGetRequest(type, query) {
  let access_token_encrypted = await dbo.tokenRetrieve("Spotify_Access");
  access_token_encrypted = access_token_encrypted.token;
  let access_token = CryptoJS.AES.decrypt(access_token_encrypted, PASS).toString(CryptoJS.enc.Utf8);
  let url = `https://api.spotify.com/v1/search?q=${query}&type=${type}&market=JP&limit=1`;
  let authorization = "Bearer " + access_token;
  let response = await fetch(url, {
      method: 'GET', 
      headers: {"Authorization": authorization}});
  return response.json();
}

async function sendPostRequest_spotify() {
  let refresh_encrypted = await dbo.tokenRetrieve("Spotify_Refresh");
  refresh_encrypted = refresh_encrypted.token;
  let refresh = CryptoJS.AES.decrypt(refresh_encrypted, PASS).toString(CryptoJS.enc.Utf8);
  let url = "https://accounts.spotify.com/api/token";
  let data = {"client_id": SPOTID, "client_secret": SPOTSECRET, "grant_type": "refresh_token", "refresh_token": refresh};
  let response = await fetch(url, {
      method: 'POST', 
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams(data)});
  return response.json();
}


module.exports = {
	name: 'spotify',
	description: 'spotify',
	execute(message, args) {
    if(args.length == 0) {
      message.channel.send("No search parameter.");
      return;
    }
    let query = "";
    let type = "track";
    if(args[0] == "artist") {
      type = "artist";
      query = String(args[1]);
      for(let i = 2; i < args.length; i++) {
        query += "+" + String(args[i]);
      }
    } else {
      query = String(args[0]);
      for(let i = 1; i < args.length; i++) {
        query += "+" + String(args[i]);
      }
    }
    sendGetRequest(type, encodeURIComponent(query))
    .then((response) => {
      if(typeof response.tracks == "undefined") {
        sendPostRequest_spotify()
        .then((response) => {
          let spotify_access_encrypted = CryptoJS.AES.encrypt(response.access_token, PASS).toString();
          dbo.tokenUpdate("Spotify_Access", spotify_access_encrypted)
          .then(() => {
            sendGetRequest(type, encodeURIComponent(query))
            .then((response) => {
              if(type == "track" && response.tracks.items.length == 0) {
                message.channel.send("No track found.");
              } else if(type == "track") {
                message.channel.send(response.tracks.items[0].external_urls.spotify);
              } else if(type == "artist" && response.artists.items.length == 0) {
                message.channel.send("No artist found.");
              } else {
                message.channel.send(response.artists.items[0].external_urls.spotify);
              }
            })
            .catch((error) => {
              console.log(error);
            });
          })
          .catch((error) => {
            console.log("[1]", error);
          });
        })
        .catch((error) => {
          console.log(error);
        });

      } else {
        if(type == "track" && response.tracks.items.length == 0) {
          message.channel.send("No track found.");
        } else if(type == "track") {
          message.channel.send(response.tracks.items[0].external_urls.spotify);
        } else if(type == "artist" && response.artists.items.length == 0) {
          message.channel.send("No artist found.");
        } else {
          message.channel.send(response.artists.items[0].external_urls.spotify);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
	},
};