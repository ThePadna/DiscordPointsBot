const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const USER_DIR = "\\users\\";
const CMD_HELP_ALL = "Commands: !points give <usr> <pts> <reason> | !points scoreboard | !points log <usr>", UNKNOWN_CMD = "Unknown Command", TOO_FEW_ARGS = "Too few arguments",
POINTS_LOG_PREFIX = "\n**====================[ %user%'s Points Log " + "]====================**\n";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

fs.readFile(__dirname + "/auth.txt", function(err, buff) {
	if(err && err.code !== 'EEXIST') {
		console.log(err);
	} else client.login(buff.toString())
});

fs.mkdir(__dirname + USER_DIR, function(err) {
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
			var ARGS_CHECK_VALIDITY = 3;
			for(var i = 0; i <= ARGS_CHECK_VALIDITY; i++) {
				var arrayIndex = (i + 1), arg = contents[arrayIndex];
				if(!arg || !arg.trim()) {
					bundleMessages(msg, [TOO_FEW_ARGS, CMD_HELP_ALL]);
					return;
				}
			}
			var tagged = msg.mentions.users;
			if(tagged.size != 1) {
				bundleMessages(msg, ["You must tag one user!", CMD_HELP_ALL]);
				return;
			}
			if(isNaN(contents[3])) {
				msg.reply("Invalid number! :(");
				return;
			}
			var points = contents[3];
			msg.reply("ptsArg:" + points);
			/* shift first 4 args */
			var SHIFT_ARGS = 3;
			for(var i = 0; i <= SHIFT_ARGS; i++) {
				contents.shift();
			}
			addPoint(tagged.get(tagged.firstKey()).tag, points, contents.join(" "));
		} else if(equalsIgnoreCase(contents[1], "scoreboard")) {
			//scoreboard code
		} else if(equalsIgnoreCase(contents[1], "log")) {
			if(typeof contents[2] === 'undefined') {
				bundleMessages(msg, [TOO_FEW_ARGS, CMD_HELP_ALL]);
				return;
			}
			var tagged = msg.mentions.users;
			if(tagged.size != 1) {
				bundleMessages(msg, ["You must tag one user!", CMD_HELP_ALL]);
				return;
			}
			var username = tagged.get(tagged.firstKey()).tag;
			filePath = __dirname + USER_DIR + username + ".json";
			if(!fs.existsSync(filePath)) {
				msg.reply("User has not recieved any points! :o");
				return;
			}
			fs.readFile(filePath, 'utf8', function callback(err, data) {
			if(err) {
				console.log(err);
			} else {
				dataFromJSON = JSON.parse(data);
				var prefix = POINTS_LOG_PREFIX.replace("%user%", username);
				var stringBuilder = prefix;
				for(var date in dataFromJSON) {
					console.log(date);
					var d = new Date(date);
					stringBuilder += ( "*[" + d.toString() + "] Points: " + dataFromJSON[date].pts + " - Reason: " + dataFromJSON[date].reason + "*\n")
				}
				stringBuilder += prefix;
				msg.reply(stringBuilder);
			}
		});
		} else {
			bundleMessages(msg, {UNKNOWN_CMD, CMD_HELP_ALL});
		}
	}
  }
});

function bundleMessages(msg, array) {
	for(i = 0; i <= (array.length - 1); i++) {
		msg.reply(array[i]);
	}
}

function equalsIgnoreCase(a, b) {
    return a.toUpperCase() === b.toUpperCase();
}

function addPoint(username, amt, reason) {
	var date = new Date();
	filePath = __dirname + USER_DIR + username + ".json";
	var passedData = {"pts":amt, "reason":reason};
	if(!fs.existsSync(filePath)) {
		var obj = {};
		obj[date.toJSON()] = passedData;
		fs.writeFile(filePath, JSON.stringify(obj, null, 4), function(err) {
			if(err) {
				console.log(err)
			}
		});
	} else {
		fs.readFile(filePath, 'utf8', function callback(err, data) {
			if(err) {
				console.log(err);
			} else {
				dataFromJSON = JSON.parse(data);
				dataFromJSON[date.toJSON()] = passedData;
				writableJSON = JSON.stringify(dataFromJSON, null, 4);
				fs.writeFile(filePath, writableJSON, function(err) {
					if(err) {
						console.log(err);
					}
				});
			}
		});
	}
}