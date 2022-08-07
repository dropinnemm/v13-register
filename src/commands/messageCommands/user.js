const { ActionRowBuilder, SelectMenuBuilder ,MessageActionRow,MessageSelectMenu, MessageEmbed} = require('discord.js');
const conf = require("../../Config/settings.json")
const randomstring = require("randomstring");
const moment = require("moment");
const fetch = require('node-fetch')
// Şemalar //

const isimler = require("../../schemas/isimler");
const regstats = require("../../schemas/registerStats");
const toplams = require("../../schemas/toplam");
var date = moment().format('L LTS')
moment.locale("tr"); 
module.exports = {
    conf: {
      aliases: ["user","info","kb"],
      name: "Kullanıcı Bilgi",
      owner: false,
      guildOnly:true,
      enabled:true
    },
  
    run: async (client, message, args) => {

        var avatarmenuid2 = randomstring.generate(15);
        var bannermenuid = randomstring.generate(14);

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const datas = await regstats.findOne({ guildID: message.guild.id, userID: member.user.id });

      

        function timestamp (value) {

            return Math.floor(new Date(value).getTime() / 1000)
          };
        var kuruluş = `<t:${timestamp(member.user.createdAt)}:D>`
        var kuruluşönce = `<t:${timestamp(member.user.createdAt)}:R>`
        var katılma = `<t:${timestamp(member.joinedAt)}:D>`
        var katılmaönce = `<t:${timestamp(member.joinedAt)}:R>`
    var katılımsırası = `${(message.guild.members.cache.filter(a => a.joinedTimestamp <= member.joinedTimestamp).size).toLocaleString()}/${(message.guild.memberCount).toLocaleString()}`
    const roles = member.roles.cache.filter(role => role.id !== message.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
    const rolleri = []
    if (roles.length > 6) {
        const lent = roles.length - 6
        let itemler = roles.slice(0, 6)
        itemler.map(x => rolleri.push(x))
        rolleri.push(`\`${lent} daha...\``)
    } else {
        roles.map(x => rolleri.push(x))
    }


        let row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId('select-raid-channel')
            .setPlaceholder('Kullanıcın Diğer Bilgileri')
            .addOptions([{
                label: `Avatar`,
                description: 'Kullanıcının Avatarı',
                value: `${avatarmenuid2}`,
            },
            {
                label: `Banner`,
                description: 'Kullanıcının Banneri',
                value: `${bannermenuid}`,
            }]))
            const data = await isimler.findOne({ guildID: message.guild.id, userID: member.user.id });
var isimlerfn = data ? data.names.splice(0, 3).map((x, i) => `\n \`${i + 1}.\` \`${x.name}\` (${x.rol})`).join("") : `\`Bulunamadı\`` 
const embed = new MessageEmbed()
.setDescription(`
**Kullanıcı bilgisi**
\` • \` Hesap: ${member}
\` • \` Kullanıcı ID: ${member.id}
\` • \` Kuruluş Tarihi: ${kuruluşönce}

**Sunucu Bilgisi**
\` • \` Sunucu İsmi: ${member.displayName}
\` • \` Katılım Tarihi: ${katılmaönce}
\` • \` Katılım Sırası: ${katılımsırası}

\` • \` Bazı Rolleri (${rolleri.length}): ${rolleri.join(", ")}
\` • \` İsim Geçmişi: ${isimlerfn}

**Yetkili Bilgisi:** 
• Toplam kayıt: \`${datas ? datas.top : 0}\` 
• Erkek kayıt : \`${datas ? datas.erkek : 0}\` 
• Kadın kayıt : \`${datas ? datas.kız : 0}\`



`)
.setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({dynamic : true}) })
.setFooter( {text : member.user.tag, iconURL : member.user.displayAvatarURL({dynamic: true})})
.setColor(client.warnColor())
.setThumbnail(member.user.displayAvatarURL({dynamic : true}))
.setTimestamp()



    await message.reply({ embeds: [embed], components: [row]  , allowedMentions: { repliedUser: false } });
                

  
client.on('interactionCreate', async interaction => {
    
    
        if (interaction.values[0] === avatarmenuid2) {

            const avatar = new MessageEmbed()
            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({dynamic : true}) })
            .setImage(member.user.displayAvatarURL({dynamic : true, size : 2048}))
            .setColor(client.warnColor())
        interaction.reply({ embeds:[avatar] , ephemeral: true });
        const bannerUrl = `${member.user.banner}`
        
        }

        if (interaction.values[0] === bannermenuid) {

           
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
        if (!receive) return interaction.reply({ content : `Kullanıcının Banneri Bulunamadı` , ephemeral: true });
        const banner2 = new MessageEmbed()
        .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({dynamic : true}) })
        .setImage(banner)
        .setColor(client.warnColor())
      
        interaction.reply({ embeds : [banner2] , ephemeral: true });
    }, 1000)
           
}})
    }}
        
        