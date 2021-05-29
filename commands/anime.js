const fetch = require("node-fetch");
const Discord = require("discord.js");
const access_token = process.env['MAL ACCESS TOKEN'];


async function sendGetRequest_1(query) {
  let url = `https://api.myanimelist.net/v2/anime?q=${query}&limit=1&nsfw=true`;
  let authorization = "Bearer " + access_token;
  let response = await fetch(url, {
      method: 'GET', 
      headers: {"Authorization": authorization}});
  return response.json();
}

async function sendGetRequest_2(id) {
  let url = `https://api.myanimelist.net/v2/anime/${id}?fields=synopsis,opening_themes,ending_themes,mean,studio,status,num_episodes,rank,studios`;
  let authorization = "Bearer " + access_token;
  let response = await fetch(url, {
      method: 'GET', 
      headers: {"Authorization": authorization}});
  return response.json();
}

module.exports = {
	name: 'anime',
	description: 'MAL API',
	execute(message, args) {
    let query = String(args[0]);
    for(let i = 1; i < args.length; i++) {
      query += "+" + String(args[i]);
    }
    sendGetRequest_1(encodeURIComponent(query))
    .then((response) => {
      sendGetRequest_2(response.data[0].node.id)
      .then((response) => {
        let opening_themes = "";
        let ending_themes = ""; 
        if(typeof response.opening_themes == "undefined") {
          opening_themes = "N/A";
        } else {
          for(i = 0; i < response.opening_themes.length; i++) {
            opening_themes += response.opening_themes[i].text + '\n';
          }
        }
        if(typeof response.ending_themes == "undefined") {
          ending_themes = "N/A";
        } else {
          for(i = 0; i < response.ending_themes.length; i++) {
            ending_themes += response.ending_themes[i].text + '\n';
          }
        }
        let result = new Discord.MessageEmbed();
        let link = "https://myanimelist.net/anime/" + response.id;
        result.setTitle(response.title);
        result.setURL(link);
        if(response.studios.length == 0) {
          result.setAuthor(`N/A`, 'https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ');
        } else {
          let studio = response.studios[0].name;
          for(i = 1; i < response.studios.length; i++) {
            studio += ", " + response.studios[i].name;
          }
          result.setAuthor(`Studio: ${studio}`, 'https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ');
        }
        result.setDescription(response.synopsis);
        result.setThumbnail(response.main_picture.large);
        result.addFields({name: ":notes: Opening Themes", value: opening_themes, inline: true}, {name: ":notes: Ending Themes", value: ending_themes, inline:true}, { name: '\u200B', value: '\u200B' }, {name: ":trophy: Rank", value: `➤    ${response.rank}`, inline: true}, {name: ":alarm_clock: Episodes", value: `➤    ${response.num_episodes}`, inline: true}, {name: ":100: Rating", value: `➤    ${response.mean}`, inline: true});
        if(response.status == "currently_airing") {
          result.setColor("#22fc00");
        } else if(response.status == "finished_airing") {
          result.setColor("#2b00ff");
        } else {
          result.setColor("#ff1100");
        }
        message.channel.send(result);
      })
      .catch((error) => {
        console.log(error);
      });
    })
    .catch((error) => {
      console.log("Query:", error);
      message.channel.send("Anime not found!");
    });
	},
};