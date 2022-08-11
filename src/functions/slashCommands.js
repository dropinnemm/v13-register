const settings = require("../Config/settings.json")
const { MessageEmbed } = require("discord.js")
const chalk = require("chalk")

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const rest = new REST({ version: '9' }).setToken(settings.token);

const slash = {
    load: async (commands, guild) => {
        const rest = new REST({ version: '9' }).setToken(settings.token);
        (async () => {
            try {
                console.log(chalk.blue('[BOT] ' + guild.name + ' sunucusuna Slash ve Komutlar yükleniyor.'));
                await rest.put(
                    Routes.applicationGuildCommands("1005632120162623579", guild.id),
                    { body: commands },
                ).then(() => {
                    console.log(chalk.green('[BOT] ' + guild.name + ' sunucusuna Slash ve Context Komutlar yüklendi.'));
                });
            }
            catch (e) {
              
               console.log(e);
            }
        })();
    },
    delete: async (guild, commandID) => {

    }
}

module.exports = slash;