const dbo = require('../databaseOps');

module.exports = {
	name: 'rank',
	description: 'rank',
	execute(message, args) {
    if(args.length == 0) {
      dbo.EXPRetrieve(message.author.id)
      .then((response) => {
        message.channel.send(`EXP: ${response.exp}`);
      });
    } else if(args.length == 1) {
      dbo.EXPRetrieve(message.mentions.users.first().id)
      .then((response) => {
        message.channel.send(`EXP: ${response.exp}`);
      })
      .catch((error) => {
        message.channel.send("User not found!");
      });
    } else {
      message.channel.send("Too many arguments!");
    }
	},
};