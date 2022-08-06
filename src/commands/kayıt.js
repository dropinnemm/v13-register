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
    name: ['kayıt', 'e','k'], //arraya istediğiniz kadar kullanım yazabilirsiniz alieses gibi saçma bir şeyle uğraşmak yerine direk arraya ekleyebilirsiniz.
    async execute(client, message, args) {


      if(!conf.Staff.some(rol => message.member.roles.cache.has(rol)) && !conf.RegisterYt.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has('ADMINISTRATOR'))  {
      message.reply(`sana noluyo amk.`) .then(msg => {
        setTimeout(() => msg.delete(), 5000)}) 
        return }


const datas = await regstats.findOne({ guildID: message.guild.id, userID: message.member.id });

        var erkekbuttonid = randomstring.generate(13);
        var kadinbuttonid = randomstring.generate(13);
        var iptalbuttonid = randomstring.generate(13);
        console.log(`Zaman : ${date}`)
        console.log(`Erkek Butonun İD : ${erkekbuttonid}`)
        console.log(`Kadın Butonun İD : ${kadinbuttonid}`)
        console.log(`İptal Butonun İD : ${iptalbuttonid}`)
        const row = new MessageActionRow()
        .addComponents(
           new MessageButton()
            .setCustomId(erkekbuttonid)
            .setEmoji('1004859372326891560')
            .setLabel("Erkek")
            .setStyle(1)
        )
        .addComponents(
          new MessageButton()
            .setCustomId(kadinbuttonid)
            .setEmoji('1004859370728853554')
            .setLabel("Kadin")
            .setStyle(3)
        )
        .addComponents(
          new MessageButton()
            .setCustomId(iptalbuttonid)
            .setEmoji('1004859562484039872')
            .setLabel("İptal")
            .setStyle(4)
        )


        const row2 = new MessageActionRow()
        .addComponents(
           new MessageButton()
            .setCustomId(erkekbuttonid)
            .setEmoji('1004859372326891560')
            .setStyle(1)
            .setLabel("Erkek")
            .setDisabled(true)
        )
        .addComponents(
          new MessageButton()
            .setCustomId(kadinbuttonid)
            .setEmoji('1004859370728853554')
            .setStyle(3)
            .setLabel("Kadın")
            .setDisabled(true)
        )
        .addComponents(
          new MessageButton()
            .setCustomId(iptalbuttonid)
            .setEmoji('1004859562484039872')
            .setStyle(4)
            .setLabel("İptal")
            .setDisabled(true)
        )






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
.setDescription(`<@!${uye.id}>, üyesinin ismi \`• ${name} | ${age}\` olarak değiştirildi 

 üyenin toplamda **${data ? `${data.names.length}` : "0"}** isim kayıtı bulundu \n
${data ? data.names.splice(0, 3).map((x, i) => `\`${x.name}\` (${x.rol})`).join("\n") : "Daha önce kayıt olmamış."}
 
`)
.setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
.setColor(client.generalColor())
.setTimestamp()
.setFooter({ text: "lütfen 30 saniye içinde seçimiinizi yapın."});


const msg = await   message.channel.send({ embeds: [embed]
, components: [row]})

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

           üyenin toplamda **${data ? `${data.names.length}` : "0"}** isim kayıtı bulundu \n
          ${data ? data.names.splice(0, 3).map((x, i) => `\`${x.name}\` (${x.rol}) (<@${x.yetkili}>)`).join("\n") : "Daha önce kayıt olmamış."}
           
          `) .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
        .setColor(client.generalColor())
        .setTimestamp()
        .setFooter({ text: `lütfen 30 saniye içinde seçimiinizi yapın.` }); 

            const embed = new MessageEmbed()
            .setDescription(`<@!${uye.id}>, üyesinin ismi \`• ${name} ${age}\` olarak değiştirildi \n ${conf.erkekRolleri.length > 1 ? conf.erkekRolleri.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + conf.erkekRolleri.map(x => `<@&${x}>`).slice(-1) : conf.erkekRolleri.map(x => `<@&${x}>`).join("")} rolleri verilerek kayıt edildi.`)
            .setAuthor({ name: uye.user.username, iconURL: uye.user.displayAvatarURL({dynamic : true})})
            .setColor(client.generalColor())
            .setTimestamp()
            .setFooter({ text: `• Toplam kayıt: ${datas ? datas.top : 0} • Erkek kayıt : ${datas ? datas.erkek : 0} • Kadın kayıt : ${datas ? datas.kız : 0}`}); 

           
           
            await uye.roles.add(conf.erkekRolleri)
            await uye.roles.remove(conf.kizRolleri[1])
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

            üyenin toplamda **${data ? `${data.names.length}` : "0"}** isim kayıtı bulundu \n
           ${data ? data.names.splice(0, 3).map((x, i) => `\`${x.name}\` (${x.rol}) (<@${x.yetkili}>)`).join("\n") : "Daha önce kayıt olmamış."}
            
           `) .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
           .setColor(client.generalColor())
         .setTimestamp()
         .setFooter({ text: "lütfen 30 saniye içinde seçimiinizi yapın."}); 
 
             const embed = new MessageEmbed()
              .setDescription(`<@!${uye.id}>, üyesinin ismi \`• ${name} ${age}\` olarak değiştirildi \n ${conf.kizRolleri.length > 1 ? conf.kizRolleri.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + conf.kizRolleri.map(x => `<@&${x}>`).slice(-1) : conf.kizRolleri.map(x => `<@&${x}>`).join("")} rolleri verilerek kayıt edildi. `)
             .setAuthor({ name: uye.user.username, iconURL: uye.user.displayAvatarURL({dynamic : true})})
             .setColor(client.generalColor())
             .setTimestamp()
             .setFooter({ text: `• Toplam kayıt: ${datas ? datas.top : 0} • Erkek kayıt : ${datas ? datas.erkek : 0} • Kadın kayıt : ${datas ? datas.kız : 0}`}); 

             let erkekRol = conf.erkekRolleri;
             let kadinRol = conf.kizRolleri;

             await uye.roles.add(conf.kizRolleri)
             await uye.roles.remove(conf.erkekRolleri[1])

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

            üyenin toplamda **${data ? `${data.names.length}` : "0"}** isim kayıtı bulundu \n
           ${data ? data.names.splice(0, 3).map((x, i) => `\`${x.name}\` (${x.rol}) (<@${x.yetkili}>)`).join("\n") : "Daha önce kayıt olmamış."}
            
           `)  .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
           .setColor(client.generalColor())
         .setTimestamp()
         .setFooter({ text: "lütfen 30 saniye içinde seçimiinizi yapın."}); 
 
             const embed = new MessageEmbed()
             .setDescription(`${message.author}, işlem iptal edildi`)
             .setAuthor({ name: uye.user.username, iconURL: uye.user.displayAvatarURL({dynamic : true})})
             .setColor(client.generalColor())
             .setTimestamp()
             .setFooter({ text: "işlem iptal edildi"});
             
          
             interaction.reply({ embeds: [ embed ], ephemeral: true });
 
             msg.edit({ embeds: [embed2], components: [row2]})
             uye.setNickname(`• İsim | Yaş`)
         }
    }
}


)}}