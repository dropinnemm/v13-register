const {discord , MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const chalk = require("chalk")
const conf = require("../../Config/settings.json")
const kanallar = require("../../Config/kanallar.json")
const randomstring = require("randomstring");
const moment = require("moment");
const emojiler = require("../../Config/emojiler.json")
const isimler = require("../../schemas/isimler");
const regstats = require("../../schemas/registerStats");
const toplams = require("../../schemas/toplam");
moment.locale("tr");
var zaman = moment().format('LL LT')

module.exports = {
  conf: {
    aliases: ["ban","jail","cezalandır"],
    name: "Ban / Jail",
    owner: false,
    guildOnly:true,
    enabled:true
  },

  run: async (client, message, args) => {
   
    
    var banbuttonid = randomstring.generate(13);
    var jailbuttonid = randomstring.generate(13);
    var baniptalbuttonid = randomstring.generate(13);
    console.log(chalk.red(`Zaman : ${zaman}`))
    console.log(chalk.red(`Ban Butonunun İD : ${banbuttonid}`))
    console.log(chalk.red(`Jail Butonunun İD : ${jailbuttonid}`))
    console.log(chalk.red(`İptal Butonun İD : ${baniptalbuttonid}`))
    const row = new MessageActionRow()
    .addComponents(
       new MessageButton()
        .setCustomId(banbuttonid)
        .setEmoji(`${emojiler.ban}`)
        .setLabel("Sunucudan Yasakla")
        .setStyle(4)
    )
    .addComponents(
      new MessageButton()
        .setCustomId(jailbuttonid)
        .setEmoji(`${emojiler.jail}`)
        .setLabel("Kullanıcıyı Jaille")
        .setStyle(4)
    )
    .addComponents(
      new MessageButton()
        .setCustomId(baniptalbuttonid)
        .setEmoji(`${emojiler.onay}`)
        .setLabel("İşlemi İptal Et")
        .setStyle(3)
    )

    const row2 = new MessageActionRow()
    .addComponents(
       new MessageButton()
        .setCustomId(banbuttonid)
        .setEmoji(`${emojiler.ban}`)
        .setLabel("Sunucudan Yasakla")
        .setStyle(4)
        .setDisabled(true)
    )
    .addComponents(
      new MessageButton()
        .setCustomId(jailbuttonid)
        .setEmoji(`${emojiler.jail}`)
        .setLabel("Kullanıcıyı Jaille")
        .setStyle(4)
        .setDisabled(true)
    )
    .addComponents(
      new MessageButton()
      .setCustomId(`${baniptalbuttonid}`)
        .setEmoji(`${emojiler.onay}`)
        .setEmoji('<:onayla:1007046680018944031>')
        .setLabel("İşlemi İptal Et")
        .setStyle(3)
        .setDisabled(true)
    )

    const row3 = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId(baniptalbuttonid)
        .setEmoji(`${emojiler.onay}`)
        .setLabel("İşlemi İptal Et")
        .setStyle(3)
        .setDisabled(true)
    )
    if(!conf.Staff.some(rol => message.member.roles.cache.has(rol)) && !conf.BanYt.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has('ADMINISTRATOR'))  {
      message.reply(`sana noluyo amk.`) .then(msg => {
        setTimeout(() => msg.delete(), 5000)}) 
        return }
        let üye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        let sebep = args.splice(1).join(" ");
        if(!üye) {
            const embed = new MessageEmbed()
             .setDescription(`${emojiler.nokta} ${message.author}, Bir kullanıcı etiketlemelisin.`)
             .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
             .setColor(client.warnColor())
             .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})
   
     message.reply({ embeds: [embed]  , allowedMentions: { repliedUser: false }})
     return }
     if(!sebep) {
        const embed = new MessageEmbed()
         .setDescription(`${emojiler.nokta} ${message.author}, Bir sebep belirtmelisin.`)
         .setAuthor({ name: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
         .setColor(client.warnColor())
         .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})

 message.reply({ embeds: [embed]  , allowedMentions: { repliedUser: false }})
 return }
 if(üye.roles.highest.position >= message.member.roles.highest.position)
 {
    const embed = new MessageEmbed()
    .setDescription(`${emojiler.nokta} ${üye}, Üyesi sizinle aynı/üst rolde bu yüzden işlem yapamıyorum. `)
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})
    .setColor(client.warnColor())
    .setFooter({ text: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
    
   message.reply({ embeds: [embed]}).then(e => {
    setTimeout(() => e.delete(), 10000)}) 
    return;
 }


 if(!üye.manageable)
{
    message.reply({ content: "Üyeye işlem yapamıyorum."}).then(e => {
        setTimeout(() => e.delete(), 2000)}) 
        return }

 const embed = new MessageEmbed()
 .setDescription(`
 ‎ 
 ${üye}, \`Kullanıcısını yasakalamak istediğiniz türü seçin\`
 ‎ `)
 .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})
 .setColor(client.warnColor())
 .setFooter({ text: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
 .setThumbnail(üye.user.displayAvatarURL({dynamic: true}))
 

 const msg = await message.channel.send({ embeds: [embed], components: [row]})
    
 
 client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) {
        if (interaction.customId === `${banbuttonid}`) {
          if(interaction.member != message.member.id)
          {
            interaction.reply({ content: "sana noluyo amk." , ephemeral: true });
  return
          }

          const embed1 = new MessageEmbed()
          .setDescription(`
          ${emojiler.ceza} ${üye}, \`Üyesi sunucudan yasaklandı.\`
          ${emojiler.nokta} Yasaklayan Yetkili : ${message.member} \`(${message.member.id})\`
          ${emojiler.chat} Yasaklama nedeni : \`${sebep}\`
          ${emojiler.kirmiziok} Yasaklanma Tarihi : \`${zaman}\` `)
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})
          .setColor(client.warnColor())
          .setFooter({ text: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
          .setThumbnail(üye.user.displayAvatarURL({dynamic: true}))

          const embed2 = new MessageEmbed()
          .setDescription(`
          ${emojiler.ceza} ${üye}, \`Üyesi sunucudan yasaklandı.\`
          ${emojiler.nokta} Yasaklayan Yetkili : ${message.member} \`(${message.member.id})\`
          ${emojiler.chat} Yasaklama nedeni : \`${sebep}\`
          ${emojiler.kirmiziok} Yasaklanma Tarihi : \`${zaman}\` `)
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})
          .setColor(client.warnColor())
          .setFooter({ text: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
           .setImage("https://media.discordapp.net/attachments/751526628340793427/781384793207472158/bangif4.gif")
          

          interaction.reply({ content: `${üye}, Üyesi sunucudan yasaklandı.` , ephemeral: true});

          msg.edit({ embeds: [embed1], components: [row2]})
    
          await üye.ban({reason : sebep})
           
          client.channels.cache.get(`${kanallar.banLog}`).send({embeds : [embed2]})

          
await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: üye.user.id }, { $push: { names: { name: üye.displayName, yetkili: message.author.id, rol: "Sunucudan Yasaklandı", date: zaman } } }, { upsert: true });
     
    }
        if (interaction.customId === `${jailbuttonid}`) {
          if(interaction.member != message.member.id)
          {
            interaction.reply({ content: "sana noluyo amk." , ephemeral: true });
    return
          }

          const embed1 = new MessageEmbed()
          .setDescription(`
          ${emojiler.ceza} ${üye}, \`Üyesi sunucuda cezalandırıldı.\`
          ${emojiler.nokta} Cezalandıran yetkili : ${message.member} \`(${message.member.id})\`
          ${emojiler.chat} Cezalandırılma nedeni : \`${sebep}\`
          ${emojiler.kirmiziok} Cezalandırılma tarihi : \`${zaman}\` `)
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})
          .setColor(client.warnColor())
          .setFooter({ text: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
          .setThumbnail(üye.user.displayAvatarURL({dynamic: true}))

          const embed2 = new MessageEmbed()
          .setDescription(`
          ${emojiler.ceza} ${üye}, \`Üyesi sunucuda cezalandırıldı.\`
          ${emojiler.nokta} Cezalandıran yetkili : ${message.member} \`(${message.member.id})\`
          ${emojiler.chat} Cezalandırılma nedeni : \`${sebep}\`
          ${emojiler.kirmiziok} Cezalandırılma tarihi : \`${zaman}\` `)
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})
          .setColor(client.warnColor())
          .setFooter({ text: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
         .setImage("https://media.discordapp.net/attachments/751526628340793427/781384793207472158/bangif4.gif")
          

          interaction.reply({ content: `${üye}, Üyesi sunucuda cezalandırıldı.` , ephemeral: true});

          msg.edit({ embeds: [embed1], components: [row2]})
         
          let digerroller = [];
          if(üye.voice.channel) üye.voice.disconnect().catch();
          üye.roles.cache.filter(r => r.id).map(r => {digerroller.push(r.id)})
          await üye.roles.remove(digerroller)
          await üye.roles.add(conf.cezalıRolleri)
          
          await isimler.findOneAndUpdate({ guildID: message.guild.id, userID: üye.user.id }, { $push: { names: { name: üye.displayName, yetkili: message.author.id, rol: "Sunucuda Jaillendi", date: zaman } } }, { upsert: true });
     
          client.channels.cache.get(`${kanallar.jailLog}`).send({embeds : [embed2]})

        }}

        if (interaction.customId === `${baniptalbuttonid}`) {
            if(interaction.member != message.member.id)
            {
              interaction.reply({ content: "sana noluyo amk." , ephemeral: true });
    return
            }
            const embed1 = new MessageEmbed()
            .setDescription(`
            ${emojiler.ceza} \`Cezalandırma işlem İptal Edildi.\` `)
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({dynamic : true})})
            .setColor(client.warnColor())
            .setFooter({ text: message.member.user.username, iconURL: message.member.user.displayAvatarURL({dynamic : true})})
   
            msg.edit({ embeds: [embed1], components: [row3]})
            interaction.reply({ content: "işlem iptal edildi." , ephemeral: true });
         
        }
})
       
  }
};



