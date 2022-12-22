require("dotenv").config()
const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');



const commands = [
    new SlashCommandBuilder().setName("ping").setDescription("Cek User ping"),
    new SlashCommandBuilder().setName("clear").setDescription("Clear message").addIntegerOption(option =>
		option.setName('number')
			.setDescription('The number of messages that you want to clear')
			.setRequired(true)),
    new SlashCommandBuilder()
	.setName('download')
	.setDescription('Download Image or Video').addSubcommand(subcommand =>
		subcommand
			.setName('twitter')
			.setDescription('Get Image or Video from Twitter')
			.addStringOption(option => option.setName('link').setDescription('Link File').setRequired(true))
            ).addSubcommand(subcommand => 
                subcommand
                    .setName("tiktok")
                    .setDescription("Get Video from Tiktok")
                    .addStringOption(option => option.setName("link").setDescription("Link File").setRequired(true))
                ),
    new SlashCommandBuilder()
                .setName("register")
                .setDescription("Registering the twitter that want to stream on")
                .addStringOption(option => option.setName("username").setDescription("The username").setRequired(true))
                .addChannelOption(option => option.setName("channel").setDescription("The channel that receive the stream").setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID,process.env.GUILD_ID),{body : commands})
    } catch (error) {
        console.error(error)
    }
})();