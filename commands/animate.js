const dbo = require('../databaseOps');

module.exports = {
	name: 'animate',
	description: 'GIF Saver',
	execute(message, args) {
    //random gif
		if(args.length == 0) {
      dbo.sizeDB()
      .then((result) => {
        if(result == 0) {
          message.channel.send("No gif in database.");
          return;
        }
        let random = Math.floor(Math.random() * result) + 1;
        dbo.retrieveGif(random)
        .then((link) => {
          message.channel.send(`[${random}] ${link}`);
        })
        .catch((error) => {
          message.channel.send(`[0] Error: ${error}`);
        });
      })
      .catch((error) => {
        message.channel.send(`[1] Error: ${error}`);
      });

    //return specific gif
    } else if(Number.isInteger(Number(args[0]))) {
      if(args.length > 1) {
        message.channel.send("Too many arguments!");
        return
      }
      if(Number(args[0]) < 1) {
        message.channel.send("Input an integer larger than 0.")
      } else {
        dbo.retrieveGif(Number(args[0]))
        .then((link) => {
          message.channel.send(`[${args[0]}] ${link}`)
        })
        .catch((error) => {
          message.channel.send(error); 
        });
      }

    //insert new gif
    } else if(args[0] == "insert") {
      //check gif link
      if(args.length > 2) {
        message.channel.send("Too many arguments!");
        return;
      }
      if(args.length < 2) {
        message.channel.send("No gif given.");
        return;
      }
      if(!args[1].startsWith("https://tenor.com/view/")) {
        message.channel.send("Gif not from tenor");
        return;
      }

      dbo.newAnimate(args[1])
      .then(() => {
        dbo.sizeDB()
        .then((result) => {
          message.channel.send(`Inserted ${args[1]} [${result}]`);
        });
      }) 
      .catch((error) => {
        message.channel.send(`Gif already exists!`);
      });

    //delete gif
    } else if(args[0] == "delete") {
      //input checking
      if(args.length > 2) {
        message.channel.send("Too many arguments!");
        return;
      }
      if(args.length < 2) {
        message.channel.send("Gif not specified!");
        return;
      }
      if(!Number.isInteger(Number(args[1]))) {
        message.channel.send(`${args[1]} is not an integer!`);
        return;
      }
      if(Number(args[1]) < 1) {
        message.channel.send("Input an integer larger than 0.");
        return;
      }

      //delete gif from database
      dbo.deleteGif(args[1])
      .then(() => {
        message.channel.send(`Gif [${args[1]}] deleted!`);
      })
      .catch((error) => {
        message.channel.send(error);
      });
    } else {
      message.channel.send("**!riebot animate help**```!riebot animate [int] (gif player)\n!riebot animate insert <gif link>\n!riebot animate delete <int>```")
    }
	},
};