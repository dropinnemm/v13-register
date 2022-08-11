const {discord , MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");

const conf = require("../../Config/settings.json")
const emojiler = require("../../Config/emojiler.json")
const randomstring = require("randomstring");
const moment = require("moment");
// Şemalar //
const chalk = require("chalk")
const isimler = require("../../schemas/isimler");
const regstats = require("../../schemas/registerStats");
const toplams = require("../../schemas/toplam");
var date = moment().format('L LTS')
moment.locale("tr"); 
module.exports = {
  conf: {
    aliases: ["kayıt","e","k"],
    name: "Kayıt",
    owner: false,
    guildOnly:true,
    enabled:true
  },

  run: async (client, message, args) => {
      
   

    if(!conf.Staff.some(rol => message.member.roles.cache.has(rol)) && !conf.RegisterYt.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has('ADMINISTRATOR'))  {
      message.reply(`sana noluyo amk.`) .then(msg => {
        setTimeout(() => msg.delete(), 5000)}) 
        return }


const datas = await regstats.findOne({ guildID: message.guild.id, userID: message.member.id });

        var erkekbuttonid = randomstring.generate(13);
        var kadinbuttonid = randomstring.generate(13);
        var iptalbuttonid = randomstring.generate(13);
        console.log(chalk.red(`Zaman : ${date}`))
        console.log(chalk.red(`Erkek Butonun İD : ${erkekbuttonid}`))
        console.log(chalk.red(`Kadın Butonun İD : ${kadinbuttonid}`))
        console.log(chalk.red(`İptal Butonun İD : ${iptalbuttonid}`))
        const row = new MessageActionRow()
        .addComponents(
           new MessageButton()
            .setCustomId(erkekbuttonid)
            .setEmoji(`${emojiler.man}`)
            .setLabel("Erkek")
            .setStyle(1)
        )
        .addComponents(
          new MessageButton()
            .setCustomId(kadinbuttonid)
            .setEmoji(`${emojiler.woman}`)
            .setLabel("Kadin")
            .setStyle(3)
        )
        .addComponents(
          new MessageButton()
            .setCustomId(iptalbuttonid)
            .setEmoji(`${emojiler.red}`)
            .setLabel("İptal")
            .setStyle(4)
        )


        const row2 = new MessageActionRow()
        .addComponents(
          new MessageButton()
           .setCustomId(erkekbuttonid)
           .setEmoji(`${emojiler.man}`)
           .setLabel("Erkek")
           .setStyle(1)
           .setDisabled(true)
       )
       .addComponents(
         new MessageButton()
           .setCustomId(kadinbuttonid)
           .setEmoji(`${emojiler.woman}`)
           .setLabel("Kadin")
           .setStyle(3)
           .setDisabled(true)
       )
       .addComponents(
         new MessageButton()
           .setCustomId(iptalbuttonid)
           .setEmoji(`${emojiler.red}`)
           .setLabel("İptal")
           .setStyle(4)
           .setDisabled(true)
       )





        let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        args = args.filter(a => a !== "" && a !== " ").splice(1);
        let name = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
        let age = args.filter(arg => !isNaN(arg))[0] || "";
        if(!uye) {
           const embed = new MessageEmbed()
            .setDescription(`${message.author}, Bir kullanıcı etiketlemelisin.`)
            .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
            .setColor(client.warnColor())
            .setFooter({ text: message.guild.name});

    message.reply({ embeds: [embed] })
    return }

    if(!name) {
        const embed = new MessageEmbed()
         .setDescription(`${message.author}, Kullanıcının ismini belirtmelisin.`)
         .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
         .setColor(client.warnColor())
         .setFooter({ text: message.guild.name});

 message.reply({ embeds: [embed] })
 return }
 if(!age) {
    const embed = new MessageEmbed()
     .setDescription(`${message.author}, Kullanıcının yaşını belirtmelisin.`)
     .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
     .setColor(client.warnColor())
     .setFooter({ text: message.guild.name});

message.reply({ embeds: [embed] })
return }

if(uye.roles.highest.position >= message.member.roles.highest.position)
{

  const embed = new MessageEmbed()
  .setDescription(`${message.author}, Kullanıcının seninle aynı/üst rolde.`)
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
.setDescription(`<@!${uye.id}>, üyesinin ismi \`• ${name} | ${age}\` olarak değiştirildi 

 üyenin toplamda **${data ? `${data.names.length}` : "0"}** isim kayıtı bulundu
${data ? data.names.splice(0, 3).map((x, i) => `\`${x.name}\` (${x.rol})`).join("\n") : "Daha önce kayıt olmamış."}
 
`)
.setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
.setColor(client.generalColor())
.setFooter({ text: "lütfen 30 saniye içinde seçimiinizi yapın."});


const msg = await   message.channel.send({ embeds: [embed], components: [row], allowedMentions: { repliedUser: false }
})

setTimeout(function() {
  msg.edit({ embeds: [embed], components: [row2]})
}, 30000)


client.on('interactionCreate', async interaction => {


    const data = await isimler.findOne({ guildID: message.guild.id, userID: uye.user.id });

    if (!interaction.isCommand()) {
        if (interaction.customId === `${erkekbuttonid}`) {
          if(interaction.member != message.member.id)
        {
          interaction.reply({ content: "sana noluyo amk." , ephemeral: true });
return
        }
           const embed2 = new MessageEmbed()
           .setDescription(`<@!${uye.id}>, üyesinin ismi \`• ${name} | ${age}\` olarak değiştirildi 

           üyenin toplamda **${data ? `${data.names.length}` : "0"}** isim kayıtı bulundu 
          ${data ? data.names.splice(0, 3).map((x, i) => `\`${x.name}\` (${x.rol}) (<@${x.yetkili}>)`).join("\n") : "Daha önce kayıt olmamış."}
           
          `) .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
        .setColor(client.generalColor())
        .setFooter({ text: `lütfen 30 saniye içinde seçimiinizi yapın.` }); 

            const embed = new MessageEmbed()
            .setDescription(`<@!${uye.id}>, üyesinin ismi \`• ${name} ${age}\` olarak değiştirildi \n ${conf.erkekRolleri.length > 1 ? conf.erkekRolleri.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + conf.erkekRolleri.map(x => `<@&${x}>`).slice(-1) : conf.erkekRolleri.map(x => `<@&${x}>`).join("")} rolleri verilerek kayıt edildi.`)
            .setAuthor({ name: uye.user.username, iconURL: uye.user.displayAvatarURL({dynamic : true})})
            .setColor(client.generalColor())
            .setFooter({ text: `• Toplam kayıt: ${datas ? datas.top : 0} • Erkek kayıt : ${datas ? datas.erkek : 0} • Kadın kayıt : ${datas ? datas.kız : 0}`}); 

           
           
            await uye.roles.add(conf.erkekRolleri)
            await uye.roles.remove(conf.kizRolleri)
            await uye.roles.remove(conf.cezalıRolleri)
          await uye.roles.remove(conf.kayıtsızRolleri)
            interaction.reply({ embeds: [ embed ], ephemeral: true });
         
            msg.edit({ embeds: [embed2], components: [row2]})

            await toplams.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { toplams: uye.user.id } }, { upsert: true });
            await regstats.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { top: 1, topGuild24: 1, topGuild7: 1, top24: 1, top7: 1, top14: 1, erkek: 1, erkek24: 1, erkek7: 1, erkek14: 1, }, }, { upsert: true });
            await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id, rol: conf.erkekRolleri.map(x => `<@&${x}>`).join(" , "), date: date } } }, { upsert: true });
            
        }
        if (interaction.customId === `${kadinbuttonid}`) {
          if(interaction.member != message.member.id)
          {
            interaction.reply({ content: "sana noluyo amk." , ephemeral: true });
  return
          }
            const embed2 = new MessageEmbed()
            .setDescription(`<@!${uye.id}>, üyesinin ismi \`• ${name} | ${age}\` olarak değiştirildi 

            üyenin toplamda **${data ? `${data.names.length}` : "0"}** isim kayıtı bulundu 
           ${data ? data.names.splice(0, 3).map((x, i) => `\`${x.name}\` (${x.rol}) (<@${x.yetkili}>)`).join("\n") : "Daha önce kayıt olmamış."}
            
           `) .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
           .setColor(client.generalColor())
  .setFooter({ text: "lütfen 30 saniye içinde seçimiinizi yapın."}); 
 
             const embed = new MessageEmbed()
              .setDescription(`<@!${uye.id}>, üyesinin ismi \`• ${name} ${age}\` olarak değiştirildi \n ${conf.kizRolleri.length > 1 ? conf.kizRolleri.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + conf.kizRolleri.map(x => `<@&${x}>`).slice(-1) : conf.kizRolleri.map(x => `<@&${x}>`).join("")} rolleri verilerek kayıt edildi. `)
             .setAuthor({ name: uye.user.username, iconURL: uye.user.displayAvatarURL({dynamic : true})})
             .setColor(client.generalColor())
          
             .setFooter({ text: `• Toplam kayıt: ${datas ? datas.top : 0} • Erkek kayıt : ${datas ? datas.erkek : 0} • Kadın kayıt : ${datas ? datas.kız : 0}`}); 

             let erkekRol = conf.erkekRolleri;
             let kadinRol = conf.kizRolleri;

             await uye.roles.add(conf.kizRolleri)
             await uye.roles.remove(conf.erkekRolleri)
             await uye.roles.remove(conf.cezalıRolleri)
           await uye.roles.remove(conf.kayıtsızRolleri)

             interaction.reply({ embeds: [ embed ], ephemeral: true });
 
             msg.edit({ embeds: [embed2], components: [row2]})

             await toplams.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { toplams: uye.user.id } }, { upsert: true });
             await regstats.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { top: 1, topGuild24: 1, topGuild7: 1, top24: 1, top7: 1, top14: 1, kız: 1, kız24: 1, kız7: 1, kız14: 1, }, }, { upsert: true });
             await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: uye.user.id }, { $push: { names: { name: uye.displayName, yetkili: message.author.id,  rol: conf.kizRolleri.map(x => `<@&${x}>`).join(" , "), date: Date.now() } } }, { upsert: true });
            

         }
         if (interaction.customId === `${iptalbuttonid}`) {
          if(interaction.member != message.member.id)
          {
            interaction.reply({ content: "sana noluyo amk." , ephemeral: true });
  return
          }

            const embed2 = new MessageEmbed()
            .setDescription(`<@!${uye.id}>, üyesinin ismi \`• ${name} | ${age}\` olarak değiştirildi 

            üyenin toplamda **${data ? `${data.names.length}` : "0"}** isim kayıtı bulundu 
           ${data ? data.names.splice(0, 3).map((x, i) => `\`${x.name}\` (${x.rol}) (<@${x.yetkili}>)`).join("\n") : "Daha önce kayıt olmamış."}
            
           `)  .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
           .setColor(client.generalColor())
    
         .setFooter({ text: "lütfen 30 saniye içinde seçimiinizi yapın."}); 
 
             const embed = new MessageEmbed()
             .setDescription(`${message.author}, işlem iptal edildi`)
             .setAuthor({ name: uye.user.username, iconURL: uye.user.displayAvatarURL({dynamic : true})})
             .setColor(client.generalColor())
          
             .setFooter({ text: "işlem iptal edildi"});
             
          
             interaction.reply({ embeds: [ embed ], ephemeral: true });
 
             msg.edit({ embeds: [embed2], components: [row2]})
             uye.setNickname(`• İsim | Yaş`)
         }
    }
}


)}}
