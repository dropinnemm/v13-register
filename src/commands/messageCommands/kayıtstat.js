const {discord , MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const chalk = require("chalk")
const conf = require("../../Config/settings.json")
const randomstring = require("randomstring");
const moment = require("moment");
// Şemalar //
const isimler = require("../../schemas/isimler");
const regstats = require("../../schemas/registerStats");
const toplams = require("../../schemas/toplam");
var date = moment().format('L LTS')
moment.locale("tr"); 
module.exports = {
  conf: {
    aliases: ["kstat","kayıtstat"],
    name: "Kayıt Stat",
    owner: false,
    guildOnly:true,
    enabled:true
  },

  run: async (client, message, args) => {
   
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(!conf.Staff.some(rol => message.member.roles.cache.has(rol)) && !conf.RegisterYt.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has('ADMINISTRATOR'))  {
    message.reply(`sana noluyo amk.`) .then(msg => {
      setTimeout(() => msg.delete(), 5000)}) 
      return }

        const data = await regstats.findOne({ guildID: message.guild.id, userID: member.id });
 
        const embed = new MessageEmbed()
        .setDescription(`  
        Toplam kayıt bilgisi: \`${data ? data.top : 0}\`
        Toplam erkek kayıt bilgisi: \`${data ? data.erkek : 0}\`
        Toplam kız kayıt bilgisi: \`${data ? data.kız : 0}\`
          `) 
          .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({dynamic : true})})
        .setColor(client.generalColor())
        .setTimestamp()
            message.reply({embeds : [embed]  , allowedMentions: { repliedUser: false }})
      }
    }