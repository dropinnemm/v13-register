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
    aliases: ["ktop","kayıttop"],
    name: "Kayıt Top",
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
        
          let registerTop = await regstats.find({ guildID: message.guild.id }).sort({ top: -1 });

          if (!registerTop.length) 
          {
          message.reply("Herhangi bir kayıt verisi bulunamadı!").then(msg => {setTimeout(() => msg.delete(), 5000)})
          return }

  const embed = new MessageEmbed()
  .setDescription(`${registerTop.map((x, i) => `\`${i + 1}.\` <@${x.userID}> - Erkek \`${x.erkek}\` Kadın \`${x.kız}\``)}`)
  .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})
  .setColor(client.generalColor())
  .setTimestamp()
      message.reply({embeds : [embed]  , allowedMentions: { repliedUser: false }})
   
      }}