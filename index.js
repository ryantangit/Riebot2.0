const fs = require('fs');
const Discord = require("discord.js");
const keepAlive = require("./server");
const dbo = require('./databaseOps');



const client = new Discord.Client();
client.commands = new Discord.Collection();

const prefix = "!riebot";

//retrieve all .js files in commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection: key = command name, value = exported module
	client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", message => {
  if(message.author.bot) {
    return;
  }
  //THIS IS THE EXP COUNTING FOR RANKINGS
  if (!message.content.startsWith(prefix)) {
    dbo.EXPUpdate(message.author.id, Math.floor(Math.random() * 50) + 1, String(new Date().getTime()));
    return;
  }

  //The arguments of each message
  //The command that is being processed
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

  //IF THE COMMAND AFTER RIEBOT IS NOT IN THE COMMAND
  if (!client.commands.has(command)) {
    message.reply("This command is not valid");
    client.commands.get("help").execute(message, args);
    return;
  }

  //Try to execute get and execute the message.
	try {
		client.commands.get(command).execute(message, args);
	} 
  catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
})

keepAlive();
client.login(process.env.TOKEN);