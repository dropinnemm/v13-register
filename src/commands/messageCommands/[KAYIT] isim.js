const {discord , MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const chalk = require("chalk")
const conf = require("../../Config/settings.json")
const emojiler = require("../../Config/emojiler.json")
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
    aliases: ["isim","isimdeğiş","isim"],
    name: "İsim Değiştir",
    owner: false,
    guildOnly:true,
    enabled:true
  },

  run: async (client, message, args) => {
      
     
    if(!conf.Staff.some(rol => message.member.roles.cache.has(rol)) && !conf.RegisterYt.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has('ADMINISTRATOR'))  {
      message.reply(`sana noluyo amk.`) .then(msg => {
        setTimeout(() => msg.delete(), 5000)}) 
        return }





        let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        args = args.filter(a => a !== "" && a !== " ").splice(1);
        let name = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
        let age = args.filter(arg => !isNaN(arg))[0] || "";
        if(!uye) {
           const embed = new MessageEmbed()
            .setDescription(`${emojiler.nokta} ${message.author}, Bir kullanıcı etiketlemelisin.`)
            .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
            .setColor(client.warnColor())
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})
   

    message.reply({ embeds: [embed]  , allowedMentions: { repliedUser: false }})
    return }

    if(!name) {
        const embed = new MessageEmbed()
        .setDescription(`${emojiler.nokta} ${message.author}, Kullanıcının ismini belirtmelisin.`)
         .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
         .setColor(client.warnColor())
         .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})
   

 message.reply({ embeds: [embed] })
 return }
 if(!age) {
    const embed = new MessageEmbed()
     .setDescription(`${emojiler.nokta} ${message.author}, Kullanıcının yaşını belirtmelisin.`)
     .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
     .setColor(client.warnColor())
     .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})
   
message.reply({ embeds: [embed] })
return }

if(uye.roles.highest.position >= message.member.roles.highest.position)
{

  const embed = new MessageEmbed()
  .setDescription(`${emojiler.nokta} ${message.author}, Kullanıcının seninle aynı/üst rolde.`)
  .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
  .setColor(client.warnColor())
  .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})
   
}

let isimfln = `• ${name} | ${age}`
console.log(chalk.red(`Kullanıcının İsminin Uzunluk Sayısı: ${isimfln.length}`))
if(isimfln.length > 32) 
{
    return message.reply("İsim çok uzun.") 
} 
else
 {
uye.setNickname(`• ${name} | ${age}`)}

const data = await isimler.findOne({ guildID: message.guild.id, userID: uye.user.id });

const embed = new MessageEmbed()
.setDescription(`${emojiler.kirmiziok} ${uye}, Üyesinin ismi \`• ${name} ${age}\` olarak değiştirildi `)
  .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
  .setColor(client.generalColor())
  .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})
   

const msg = await   message.channel.send({embeds: [embed]})

uye.setNickname(`• ${name} | ${age}`)

await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id, rol: "İsim Değişikliği", date: date } } }, { upsert: true });
            
   
  }
};