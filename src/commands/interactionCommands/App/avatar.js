const { MessageEmbed } = require('discord.js');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v10');

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Avatar')
    .setType(ApplicationCommandType.User),
        
  async execute(interaction, client) {
        const member = client.users.cache.get(interaction.targetId);
        const embed = new MessageEmbed()
        .setAuthor({ name: member.username, iconURL: member.displayAvatarURL({dynamic : true}) })
        .setFooter( {text : member.tag, iconURL : member.displayAvatarURL({dynamic: true})})
        .setColor(client.warnColor())
        .setImage(member.displayAvatarURL({dynamic:true, size : 2048}))
        .setTimestamp()


        await interaction.reply({ embeds: [embed] , ephemeral: true });
    }
};

