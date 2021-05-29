const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.json());

app.all("/", (req, res) => {
  res.send("Bot is running!");
});

app.get("/auth/accepted/spotify", (request, response) => {
  console.log(request.url);
  sendPostRequest_spotify(request.query.code)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });
  response.sendStatus(200);
});

app.get("/auth/accepted", (request, response) => {
  sendPostRequest_mal(request.query.code)
  .then((response) => {
    let access_token = response.access_token;
    let refresh_token = response.refresh_token;
  })
  .catch((error) => {
    console.log("Error:", error);
  });
  response.sendStatus(200);
});

function keepAlive() {
  app.listen(3000, () => {
    console.log("Server is ready.");
  })
}

const MALSecret = process.env['MAL SECRET']
const MALID = process.env['MAL ID']
const code_verifier = process.env['CODE VERIFIER']


async function sendPostRequest_mal(code) {
  let url = "https://myanimelist.net/v1/oauth2/token";
  let data = {"client_id": MALID, "client_secret": MALSecret, "code": code, "code_verifier": code_verifier, "grant_type": "authorization_code"};
  let response = await fetch(url, {
      method: 'POST', 
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams(data)});
  return response.json();
}


const SPOTSECRET = process.env['SPOTIFY SECRET']
const SPOTID = process.env['SPOTIFY ID']


async function sendPostRequest_spotify(code) {
  let url = "https://accounts.spotify.com/api/token";
  let data = {"client_id": SPOTID, "client_secret": SPOTSECRET, "code": code, "redirect_uri": "https://riebot-v2.fhusion.repl.co/auth/accepted/spotify", "grant_type": "authorization_code"};
  let response = await fetch(url, {
      method: 'POST', 
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams(data)});
  return response.json();
}

async function sendGetRequest(token) {
  let url = "https://api.myanimelist.net/v2/anime?q=diamond&limit=1";
  let authorization = "Bearer " + token;
  let response = await fetch(url, {
      method: 'GET', 
      headers: {"Authorization": authorization}});
  return response.json();
}

module.exports = keepAlive;