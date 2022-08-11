const chalk = require("chalk");
var settings = require("../Config/settings.json")
let client = global.client
const { MessageEmbed } = require("discord.js")


module.exports =  async(client) => {





// Load slash commands
let slashcommands = global.slashcommands
let slashFunction = require("../functions/slashCommands")
client.guilds.cache.forEach(element => {
    slashFunction.load(slashcommands,element)
});
// Load slash commands





await console.log(chalk.magenta("[BOT] " + client.user.username + " ile giriş yapıldı!"))
}

module.exports.conf = {
    name: "ready",
  };

  /* Bu altyapi theChain tarafından yapılmıştır! Eger bir sorun yasar iseniz github profilimden discord profilime ulaşabilirsiniz */
/* Emeğe saygı konusunda altyapıyı kendininiz çalmamanız her türlü daha hoş olur */