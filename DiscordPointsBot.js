const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const CMD_HELP_ALL = "Commands: !points give <usr> <pts> <reason> | !points scoreboard", UNKNOWN_CMD = "Unknown Command", TOO_FEW_ARGS = "Too few arguments";


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

fs.readFile(__dirname + "/auth.txt", function(err, buff) {
	if(err && err.code !== 'EEXIST') {
		console.log(err);
	} else client.login(buff.toString());
}

fs.mkdir(__dirname + "/users/", function(err) {
	if(err && err.code !== 'EEXIST') {
		console.log(err);
	}
});

client.on('message', msg => {
  if (msg.content.startsWith("!points")) {
    var contents = msg.content.split(" ");
	if(typeof contents[1] == 'undefined') {
		msg.reply(CMD_HELP_ALL);
		msg.reply("debug1");
	} else {
		if(equalsIgnoreCase(contents[1], "give")) {
			if(typeof contents[2] == 'undefined' || typeof contents[3] == 'undefined' || typeof contents[4] == 'undefined') {
				bundleMessages(msg, [TOO_FEW_ARGS, CMD_HELP_ALL]);
				return;
			}
			msg.reply("debug 4");
			var isVerified = this.verifyUser(contents[2]);
			if(!isVerified) {
				msg.reply("User doesn't exist! o_O");s
				return;
			}
			if(isNaN(contents[3])) {
				msg.reply("Invalid number! :(");
				return;
			}
			var reason = [], i = 4;
			/* discord max message count is below MAX_VALUE */
			addPoint(contents[2], contents[3], reason.join(" "));
		} else if(equalsIgnoreCase(contents[1], "scoreboard")) {
			//scoreboard code
		} else {
			bundleMessages(msg, {UNKNOWN_CMD, CMD_HELP_ALL});
		}
	}
  }
});

function bundleMessages(msg, array) {
	for(i = 0; i <= (array.length - 1); i++) {
		msg.reply("test" + i);
	}
}

function equalsIgnoreCase(a, b) {
    return a.toUpperCase() === b.toUpperCase();
}
	
function verifyUser(username) {
	var exists = false;
	for(u in client.users) {
		if(u.username.equals(username)) exists = !exists;
	}
	return exists;
}

function addPoint(username, amt, reason) {
	reason.replace(' ', '_');
	filePath = __dirname + this.userDir + username + ".json";
	if(!getCFG(username)) {
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

function defCallback(err) {
	console.log(err);
}