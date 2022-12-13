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
		if (media.type === "video" || media.type === "animated_gif") {
			try {
				// const card = {
				// 	embed: {
				// 		color: 10422355,
				// 		video: {
				// 			url: media.media.url,
				// 		},
				// 	},
				// };

				// console.log(card)
				// await interaction.reply(card);

				const videos = []
				media.media.forEach((p) => {
					videos.push(new AttachmentBuilder().setFile(p.url));
				})
				console.log(videos)
				await interaction.followUp("https://video.twimg.com/ext_tw_video/1179778992112459776/pu/vid/720x1280/_099oen942JHFm8B.mp4?tag=10")
			} catch (error1) {
				const sentAttachment = new AttachmentBuilder(media.media[0].url);
				await interaction.reply({
					content: "",
					files: [sentAttachment],
				});
			}
		}

		if (media.type === "photo") {
			const photos = [];
			media.media.forEach((p) => {
				photos.push(new EmbedBuilder().setImage(p.url));
			});
			await interaction.reply({embeds: [...photos]});
		}
		// await waitMsg.delete();
	} catch (error) {
		console.log("Failed to download tweet", error.message);
	}
		}
	}
})




client.login(process.env.BOT_TOKEN)