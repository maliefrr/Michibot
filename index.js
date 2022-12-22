const {Client, GatewayIntentBits, ActivityType, Message, EmbedBuilder, DiscordAPIError, AttachmentBuilder} = require("discord.js")
const dotenv = require("dotenv").config();
const client = new Client({intents : [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]});
const {getStatusID, getTweet, parseMedia, Twit, getTwitterId} = require("./services/helpers/twitter")

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
		const m = await interaction.reply({content: "Pinging...", ephemeral: true});
		interaction.editReply({content: `Your ping Latency is ${Math.round(client.ws.ping)}ms`, ephemeral: true});
	}
	if(commandName === 'clear'){
        const {channel,options} = interaction;

        const amount = options.getInteger("number");

        const res = new EmbedBuilder().setColor(0x5fb041)

        await channel.bulkDelete(amount, true).then(messages => {
            interaction.reply({content: `Successfully deleted ${messages.size} message from channel`, ephemeral: true})
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
		if (media.type === "video" || media.type === "animated_gif") {
			try {

				const videos = []
				console.log(interaction.channel.id)
				media.media.forEach((p) => {
					videos.push(p.url);
				})
				await interaction.reply({content: `${[...videos]}`})
			} catch (error1) {
				console.log(error1.message)
				interaction.reply("error while downloading tweet")
			}
		}

		if (media.type === "photo") {
			const photos = [];
			media.media.forEach((p) => {
				photos.push(new EmbedBuilder().setImage(p.url).setTitle(`Photos from ${media.user}`));
			});
			await interaction.reply({embeds: [...photos]});
		}
		// await waitMsg.delete();
	} catch (error) {
		console.log("Failed to download tweet", error.message);
	}
		}
	}
	if(commandName === "register"){
		console.log(getTwitterId(interaction.options.getString("username")))
		// const stream = Twit.stream('statuses/filter',{follow : getTwitterId(interaction.options.getString("username"))})
		// stream.on("tweet", tweet => {
		// 	const channel = interaction.options.get("channel").value;

		// 	if(channel){
		// 		console.log(tweet)
		// 		interaction.channel.send(tweet.text)
		// 	}
		// })
		interaction.reply(`The ${interaction.options.getString("username")} tweet will be send in ${interaction.options.getChannel("channel")}`)
	}
})




client.login(process.env.BOT_TOKEN)