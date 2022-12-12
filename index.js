const {Client, GatewayIntentBits, ActivityType, Message, EmbedBuilder} = require("discord.js")
const dotenv = require("dotenv").config();
const client = new Client({intents : GatewayIntentBits.Guilds});

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
})

client.login(process.env.BOT_TOKEN)