const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
userDir = "/users/";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(client.users);
});

client.on('message', msg => {
  if (msg.content.startsWith("!give")) {
    var contents = msg.content.split(" ");
	if(typeof contents[1] == 'undefined') {
		msg.reply("To who? !give <user> <pts> <reason>");
		msg.reply("!give <user> <pts> <reason>");
		return;
	} else {
		
	}
  }
});



client.login('NTM4MDAyMTUzNTU4NjM4NTky.Dytdng.iPU7iI37hgH3kxlDq-tlFMnJQhY');
fs.mkdir("users", function(err) {});

function userExists(username) {
	found = false, user;
	for(u in client.users) {
		if(u.username.equals(username)) found = true;
	}
	return found;
}

function addPoint(user, amt, reason) {
	reason.replace(' ', '_');
	filePath = this.userDir + user.username + ".json";
	if(!getCFG(user.username)) {
		var data = {
			reason:amt
		};
		fs.createFile(filePath, JSON.stringify(data), this.defCallback(err));
	} else {
		fs.readFile(filePath, 'utf8', function callback(err, data) {
			if(err) {
				console.log(err);
			} else {
				jsonObj = JSON.parse(data);
				jsonObj.push({reason:amt});
				back2json = JSON.stringify(jsonObj);
				fs.writeFile(filePath, 'utf8', this.defCallback(err));
			}
		});
	}
}

function getCFG(username) {
	
}

function defCallback(err) {
	console.log(err);
}