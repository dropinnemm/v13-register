const { MessageEmbed, Message, Collection } = require("discord.js");
const settings = require("../Config/settings.json")
const client = global.client;
const chalk = require("chalk")


module.exports = async (message) => {

    // usenmesem cooldown :D
    let prefix = settings.prefix


    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;
    let args = message.content.substring(prefix.length).trim().split(" ");  // Argları ayıklama
    let commandName = args[0].toLowerCase() // Komut ismi alma

    args = args.splice(1) // Argstan komutu silme

   
    let cmd = client.commands.has(commandName) ? client.commands.get(commandName) : client.commands.get(client.aliases.get(commandName)); // Oyle bir komut avr mı diye sorgulamak

    if (cmd) {


        try {
            cmd.run(client, message, args,  prefix);
            
        } catch (error) {
            console.log(chalk.red("[HATA] bir komut çalıştırılırken bir problem yaşandı!"));
            console.error(error);
            message.reply({ content: 'Komutu çalıştırırken hata ile karşılaştım geliştiricime ulaşın.' });
        }
    } else {
        // Komut bulunamadı - şunu mu demek istediniz?
        const allCommands = [];
        const sameCommands = [];
        client.commands.forEach(cmd => {
            allCommands.push(cmd.conf.name)
            cmd.conf.aliases.forEach(a => {
                allCommands.push(a)
            })
        })
        let slicedCommand = commandName.slice(0, 2)
        allCommands.forEach(command => {
            if (command.startsWith(slicedCommand)) return sameCommands.push(command)
        })
       
    }
}

// usenmesem cooldown :D
module.exports.conf = {
    name: "messageCreate",
};

/* Bu altyapi theChain tarafından yapılmıştır! Eger bir sorun yasar iseniz github profilimden discord profilime ulaşabilirsiniz */
/* Emeğe saygı konusunda altyapıyı kendininiz çalmamanız her türlü daha hoş olur */