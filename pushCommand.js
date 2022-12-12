require("dotenv").config()
const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');



const commands = [
    new SlashCommandBuilder().setName("ping").setDescription("Cek User ping"),
    new SlashCommandBuilder().setName("clear").setDescription("Clear message").addIntegerOption(option =>
		option.setName('number')
			.setDescription('The number of messages that you want to clear')
			.setRequired(true)),
    new SlashCommandBuilder().setName("download").setDescription("Download image and video from twitter").addStringOption(cmd => cmd.setName("link").setDescription("Link video or image twitter").setRequired(true))
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