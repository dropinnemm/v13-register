const { MessageEmbed } = require('discord.js');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v10');
const fetch = require('node-fetch');
module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Banner')
    .setType(ApplicationCommandType.User),
        
  async execute(interaction, client) {
        const member = client.users.cache.get(interaction.targetId);
        
let uid = member.id

 
let response = fetch(`https://discord.com/api/v8/users/${uid}`, {
    method: 'GET',
    headers: {
        Authorization: `Bot ${client.token}`
    }
})

let receive = ''
let banner = 'https://cdn.discordapp.com/attachments/829722741288337428/834016013678673950/banner_invisible.gif'

response.then(a => {
    if (a.status !== 404) {
        a.json().then(data => {
            receive = data['banner']
           

            if (receive !== null) {

                let response2 = fetch(`https://cdn.discordapp.com/banners/${uid}/${receive}.gif`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bot ${client.token}`
                    }
                })
                let statut = ''
                response2.then(b => {
                    statut = b.status
                    banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.gif?size=1024`
                    if (statut === 415) {
                        banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.png?size=1024`
                    }

                })
            }
        })
    }
})




setTimeout(() => {
    const banner32 = new MessageEmbed()
    .setAuthor({ name: member.tag, iconURL: member.displayAvatarURL({dynamic : true}) })
    .setDescription("Kullanıcının Banneri Bulunamadı")
    .setColor(client.warnColor())
    if (!receive) return interaction.reply({ embeds: [banner32], ephemeral: true});
    const banner3 = new MessageEmbed()
    .setAuthor({ name: member.tag, iconURL: member.displayAvatarURL({dynamic : true}) })
    .setImage(banner)
    .setColor(client.warnColor())
  
    interaction.reply({ embeds: [banner3], ephemeral: true});
                
}, 1000)
       

    }
};

