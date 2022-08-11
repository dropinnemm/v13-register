const {discord , MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const chalk = require("chalk")
const conf = require("../../Config/settings.json")
const randomstring = require("randomstring");
const moment = require("moment");
// Şemalar //
const nameData = require("../../schemas/isimler");
const regstats = require("../../schemas/registerStats");
const toplams = require("../../schemas/toplam");
var date = moment().format('L LTS')
moment.locale("tr"); 
module.exports = {
  conf: {
    aliases: ["isimler","isimleri","names"],
    name: "İsimler",
    owner: false,
    guildOnly:true,
    enabled:true
  },

  run: async (client, message, args) => {
    var sıfırla = randomstring.generate(13);
    const row = new MessageActionRow()
    .addComponents(
       new MessageButton()
        .setCustomId(sıfırla)
      
        .setStyle(4)
        .setLabel("Sıfırla")
    )

    const row2 = new MessageActionRow()
    .addComponents(
       new MessageButton()
        .setCustomId(sıfırla)
      
        .setStyle(4)
        .setLabel("Sıfırla")
        .setDisabled(true)
    )


    if(!conf.Staff.some(rol => message.member.roles.cache.has(rol)) && !conf.RegisterYt.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has('ADMINISTRATOR'))  {
       message.reply(`sana noluyo amk.`) .then(msg => {
         setTimeout(() => msg.delete(), 5000)}) 
         return }
 

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const data = await nameData.findOne({ guildID: message.guild.id, userID: member.user.id });

   const embed = new MessageEmbed()
.setDescription(data ? data.names.splice(0, 10).map((x, i) => `\`${i + 1}.\` \`${x.name}\` (${x.rol})`).join("\n") : "Bu kullanıcıya ait isim geçmişi bulunmuyor!")   
.setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({dynamic : true})})
.setColor(client.generalColor())
.setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})
   
 
const msg = await message.reply({ embeds: [embed], components: [row] , allowedMentions: { repliedUser: false }}) 
  

   client.on('interactionCreate', async interaction => {


    if (!interaction.isCommand()) {
        if (interaction.customId === `${sıfırla}`) {
 if(interaction.member != message.member.id)
      {
        interaction.reply({ content: "sana noluyo amk." , ephemeral: true });
return
      }

          await nameData.deleteOne({ guildID: message.guild.id, userID: member.user.id });

          const embedtmm = new MessageEmbed()
          .setDescription(`Üyenin isimler datası \`sıfırlandı\``)   
          .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({dynamic : true})})
          .setColor(client.warnColor())
          .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})
   


       
       interaction.reply({ embeds: [ embedtmm ], ephemeral: true });

       msg.edit({ embeds: [ embed ], components: [row2] })

        }}})}}