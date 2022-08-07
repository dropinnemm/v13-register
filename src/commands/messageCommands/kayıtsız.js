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
    aliases: ["kayıtsız","kayıtsiz","kayitsiz"],
    name: "Kayıtsız",
    owner: false,
    guildOnly:true,
    enabled:true
  },

  run: async (client, message, args) => {
      
     if(!conf.Staff.some(rol => message.member.roles.cache.has(rol)) && !conf.RegisterYt.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has('ADMINISTRATOR'))  {
         message.reply(`sana noluyo amk.`) .then(msg => {
           setTimeout(() => msg.delete(), 5000)}) 
           return }
   

      const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
      if(!uye) {
         const embed = new MessageEmbed()
          .setDescription(`${message.author}, Bir kullanıcı etiketlemelisin canım benim aşk bahçem.`)
          .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
          .setColor(client.warnColor())
          .setTimestamp()
          .setFooter({ text: message.guild.name , iconURL: message.guild.iconURL({dynamic : true})});
  
          message.reply({ embeds: [embed] })
  return }


  if(uye.roles.highest.position >= message.member.roles.highest.position)
  {

   const embed = new MessageEmbed()
   .setDescription(`${message.author}, Kullanıcıyla aynı rol/düşük roldesin canım benim aşk bahçem.`)
   .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
   .setColor(client.warnColor())
   .setTimestamp()
   .setFooter({ text: message.guild.name , iconURL: message.guild.iconURL({dynamic : true})});

   message.reply({ embeds: [embed] })
return 
  }

  if (!uye.manageable) 
  {
   const embed = new MessageEmbed()
   .setDescription(`${message.author}, Kullanıcıya işlem yapamıyorum canım benim aşk bahçem.`)
   .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
   .setColor(client.warnColor())
   .setTimestamp()
   .setFooter({ text: message.guild.name , iconURL: message.guild.iconURL({dynamic : true})});

   message.reply({ embeds: [embed] })
return 



  }
     
  const embed = new MessageEmbed()
  .setDescription(`${uye} üyesi ${message.author} tarafından kayıtsıza atıldı.`)
  .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
  .setColor(client.warnColor())
  .setTimestamp()
  .setFooter({ text: uye.user.username, iconURL: uye.user.displayAvatarURL({dynamic : true})});

  message.reply({ embeds: [embed] , allowedMentions: { repliedUser: false }})


  await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id, rol: "Kayıtsıza Atıldı", date: date } } }, { upsert: true });
            
 
  let digerroller = [];
if(uye.voice.channel) uye.voice.disconnect().catch();
uye.roles.cache.filter(r => r.id).map(r => {digerroller.push(r.id)})
await uye.roles.remove(digerroller)
await uye.roles.add(conf.kayıtsızRolleri)


          }
         }