const Discord = require("discord.js");


module.exports = {
  name: 'help',
  description: "This is the tooltip to find what commands are there",
  //The execute function of this module is to send the help
  execute(message, args){
    const newEmbed = new Discord.MessageEmbed();
    /*
      START OF EDITING EMBED FIELD
    */
      newEmbed.setTitle("!Riebot Commands");
      newEmbed.addFields(
        {name: "animate", value: '"",<index>, insert <tenor gif>, delete <anime index>'},
        {name: "anime", value: "<anime/artist name>"},
        {name: "help", value: "< >"},
        {name: "ping", value: "< >"},
        {name: "rank", value: "<(optional) @user>"},
        {name: "spotify", value: "<song/artist>"},
        {name: "weather", value: "<zipcode>"}
      );
//banned
      if(message.author.id === "620394107616886786") {
        newEmbed.setTitle('AHHH BICDICKYYYYYY');
      }
    /*
      END OF EDITING EMBED FIELD stop fking w the console
   */
    message.channel.send(newEmbed);
  }
}