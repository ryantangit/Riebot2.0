const fetch = require("node-fetch");
const Discord = require("discord.js");
const api_key = process.env['OPEN WEATHER API KEY'];  
const days_of_the_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


async function sendGetRequest_1(zip) {
  let url = `http://api.openweathermap.org/data/2.5/weather?zip=${zip},US&appid=${api_key}`;
  let response = await fetch(url, {
      method: 'GET'});
  return response.json();
}

async function sendGetRequest_2(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${api_key}`;
  let response = await fetch(url, {
      method: 'GET'});
  return response.json();
}

function time_return(sec, offset) {
  let time = new Date((sec + offset) * 1000);
  let minutes = "0" + time.getMinutes();
  return time.getHours() + ":" + minutes.substr(-2);
}

function temp_convert(temp) {
  let cel = temp - 273.15
  let faren = (cel * 9/5) + 32;
  return faren.toFixed(1) + "°F / " + cel.toFixed(1) + "°C";
}

function wind_direction(degree) {
  switch(true) {
    case(degree < 12):
      return "N";
    case(degree < 34):
      return "NNE";
    case(degree < 57):
      return "NE";
    case(degree < 79):
      return "ENE";
    case(degree < 102):
      return "E";
    case(degree < 124):
      return "ESE";
    case(degree < 147):
      return "SE";
    case(degree < 169):
      return "SSE";
    case(degree < 192):
      return "S";
    case(degree < 214):
      return "SSW";
    case(degree < 237):
      return "SW";
    case(degree < 259):
      return "WSW";
    case(degree < 282):
      return "W";
    case(degree < 304):
      return "WNW";
    case(degree < 327):
      return "NW";
    case(degree < 349):
      return "NNW";
    default:
      return "N";
  }
}

function title_cap(string) {
  let sentence = string.toLowerCase().split(" ");
  for(let i = 0; i< sentence.length; i++){
    sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
  }
  return sentence.join(" ");
}

function title_date(sec, offset) {
  let time = time_return(sec, offset);
  let date = new Date((sec + offset) * 1000);
  date = String(Number(date.getMonth()) + 1) + "/" + date.getDate();
  return date + " " + time;
}

function date_convert(sec, offset) {
  let date = new Date((sec + offset) * 1000);
  return String(Number(date.getMonth()) + 1) + "/" + date.getDate();
}

module.exports = {
	name: 'weather',
	description: 'Weather',
	execute(message, args) {
		sendGetRequest_1(args[0])
    .then((response) => {
      let current_temp = temp_convert(response.main.temp);
      let feels_like_temp = temp_convert(response.main.feels_like);
      let result = new Discord.MessageEmbed();
      result.setTitle(`${response.name}, ${title_cap(response.weather[0].description)}, ${title_date(response.dt, response.timezone)}`);
      result.setDescription(`**Current Temperature:** ${current_temp}\n**Feels Like:** ${feels_like_temp}\n**Wind:** ${(response.wind.speed * 2.237).toFixed(1)} mph ${wind_direction(response.wind.deg)}\n**Humidity:** ${response.main.humidity}%\n**Sunrise:** ${time_return(response.sys.sunrise, response.timezone)}\n**Sunset:** ${time_return(response.sys.sunset, response.timezone)}`);
      result.setThumbnail(`http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);

      sendGetRequest_2(response.coord.lat, response.coord.lon) 
      .then((response) => {
        let alerts = "";
        if(typeof response.alerts == "undefined") {
          alerts = "None";
        } else {
          for(let i = 0; i < response.alerts.length; i++) {
            alerts += response.alerts[i].sender_name + ": " + response.alerts[i].event + " (" + date_convert(response.alerts[i].start, response.timezone_offset) + " - " + date_convert(response.alerts[i].end, response.timezone_offset) + ")\n";
          }
        }
        let day = new Date((response.daily[1].dt + response.timezone_offset) * 1000).getDay();
        result.addFields({name: days_of_the_week[day%7], value: `**Min:** ${temp_convert(response.daily[1].temp.min)}\n**Max:** ${temp_convert(response.daily[1].temp.max)}`, inline: true}, {name: days_of_the_week[(day+1)%7], value: `**Min:** ${temp_convert(response.daily[2].temp.min)}\n**Max:** ${temp_convert(response.daily[2].temp.max)}`, inline: true}, {name: days_of_the_week[(day+2)%7], value: `**Min:** ${temp_convert(response.daily[3].temp.min)}\n**Max:** ${temp_convert(response.daily[3].temp.max)}`, inline: true}, {name: days_of_the_week[(day+3)%7], value: `**Min:** ${temp_convert(response.daily[4].temp.min)}\n**Max:** ${temp_convert(response.daily[4].temp.max)}`, inline: true}, {name: days_of_the_week[(day+4)%7], value: `**Min:** ${temp_convert(response.daily[5].temp.min)}\n**Max:** ${temp_convert(response.daily[5].temp.max)}`, inline: true}, {name: "Alerts", value: 
       `${alerts}`});

        result.setColor("#4287f5");
        message.channel.send(result);
      })
      .catch((error) => {
        console.log(error);
      });
    })
    .catch((error) => {
      console.log(error);
    });
	},
};