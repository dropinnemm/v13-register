const {discord , MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");

const conf = require("../Config/settings.json")
const randomstring = require("randomstring");
const moment = require("moment");
// Şemalar //
const isimler = require("../schemas/isimler");
const regstats = require("../schemas/registerStats");
const toplams = require("../schemas/toplam");
var date = moment().format('L LTS')
moment.locale("tr"); 
module.exports = {
    slash: false, //kodun slash olmadığını belirttik.
    name: ['isim', 'isim'], //arraya istediğiniz kadar kullanım yazabilirsiniz alieses gibi saçma bir şeyle uğraşmak yerine direk arraya ekleyebilirsiniz.
    async execute(client, message, args) {


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
            .setDescription(`${message.author}, Bir kullanıcı etiketlemelisin canım benim aşk bahçem.`)
            .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
            .setColor(client.warnColor())
            .setTimestamp()
            .setFooter({ text: message.guild.name});

    message.reply({ embeds: [embed] })
    return }

    if(!name) {
        const embed = new MessageEmbed()
         .setDescription(`${message.author}, Kullanıcının ismini belirtmelisin canım benim aşk bahçem.`)
         .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
         .setColor(client.warnColor())
         .setTimestamp()
         .setFooter({ text: message.guild.name});

 message.reply({ embeds: [embed] })
 return }
 if(!age) {
    const embed = new MessageEmbed()
     .setDescription(`${message.author}, Kullanıcının yaşını belirtmelisin canım benim aşk bahçem.`)
     .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
     .setColor(client.warnColor())
     .setTimestamp()
     .setFooter({ text: message.guild.name});

message.reply({ embeds: [embed] })
return }

if(uye.roles.highest.position >= message.member.roles.highest.position)
{

  const embed = new MessageEmbed()
  .setDescription(`${message.author}, Kullanıcının seninle aynı rolde canım benim aşk bahçem.`)
  .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
  .setColor(client.warnColor())
  .setTimestamp()
  .setFooter({ text: message.guild.name});
}

let isimfln = `• ${name} | ${age}`
console.log(`Kullanıcının İsminin Uzunluk Sayısı: ${isimfln.length}`)
if(isimfln.length > 32) 
{
    return message.reply("İsim çok uzun.") 
} 
else
 {
uye.setNickname(`• ${name} | ${age}`)}

const data = await isimler.findOne({ guildID: message.guild.id, userID: uye.user.id });

const embed = new MessageEmbed()
.setDescription(`<@!${uye.id}>, üyesinin ismi \`• ${name} ${age}\` olarak değiştirildi `)
  .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
  .setColor(client.generalColor())
  .setTimestamp()
  .setFooter({ text: message.guild.name});

const msg = await   message.channel.send({embeds: [embed]})

uye.setNickname(`• ${name} | ${age}`)

await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id, rol: "İsim Değişikliği", date: date } } }, { upsert: true });
            
   

    }}