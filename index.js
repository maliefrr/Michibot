const { DiscordAPIError, AttachmentBuilder } = require("discord.js");
const {Client, GatewayIntentBits, ActivityType, Message, EmbedBuilder} = require("discord.js")
const dotenv = require("dotenv").config();
const client = new Client({intents : GatewayIntentBits.Guilds});
const {getStatusID, getTweet, parseMedia} = require("./services/helpers/twitter")

client.on("ready",() => {
	client.user.setPresence({
		activities: [{ name: `Michie Dancing`, type: ActivityType.Watching }],
		status: 'dnd',
	});
    console.log(`Discord Connected: Logged in as ${client.user.tag}!, ${client.user.avatarURL()}`)
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if(commandName === 'ping') {
		const m = await interaction.reply("Pinging...");
		interaction.editReply(`Your ping Latency is ${Math.round(client.ws.ping)}ms`);
	}
	if(commandName === 'clear'){
        const {channel,options} = interaction;

        const amount = options.getInteger("number");

        const res = new EmbedBuilder().setColor(0x5fb041)

        await channel.bulkDelete(amount, true).then(messages => {
            res.setDescription(`Successfully deleted ${messages.size} message from channel`);
            interaction.reply({embeds: [res]})
        })
	}
	if(commandName === "download"){
		const {options} = interaction;
		if(options.getSubcommand() === "twitter"){
			const url = options.getString("link")
			try {
		const tweetID = getStatusID(url);
		const tweet = await getTweet(tweetID);
		const media = parseMedia(tweet);
		let tmp = []
		// console.log(media.media)
		media.media.forEach(element => {
			tmp.push((element.url))
		});
		console.log(tmp)
		// for(let i = 0 ; i < tmp.length; i++){
		// 	interaction.reply(tmp[i])
		// }
		interaction.reply({embeds: [...tmp]})
		// if (!media) return;

		// const waitMsg = await msg.lineReplyNoMention('Downloading...');
	} catch (error) {
		console.log("Failed to download tweet", error.message);
	}
		}
	}
})




client.login(process.env.BOT_TOKEN)