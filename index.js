//botun main dosyası 
const settings = require("./src/base/settings.json");
const conf = require("./src/Config/settings.json");
const { getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");
const discord = require("discord.js");
const client = new discord.Client({ intents: Object.values(discord.Intents.FLAGS).reduce((x, y) => x + y, 0) });
const { token } = require("./src/base/settings.json");
const messageCreate = require("./src/events/messageCreate");
require("./src/base/app.js")(client)

client.login(token);


Array.prototype.random = function () {return this[Math.floor((Math.random()*this.length))]};
client.general = {"color1": "#389e60", "color2": "#ddd0a9", "color3": "#f23e38", "color4": "#344fa1", "color5": "#344fa1", "color6": "#51c2d5", "color7": "#6994f0", "color8": "#159ffd"}; client.generalColor = function () {return client.general[Object.keys(client.general).random()]}
client.man = {"color1": "#77acf1", "color2": "#51c4d3", "color3": "#8fd6e1", "color4": "#8ab6d6"}; client.manColor = function () {return client.man[Object.keys(client.man).random()]}
client.woman = {"color1": "#ff96ad", "color2": "#e798ae", "color3": "#e798ae", "color4": "#e4bad4"}; client.womanColor = function () {return client.woman[Object.keys(client.woman).random()]}
client.warn = {"color1": "#f23e38", "color2": "#d63b3b", "color3": "#bd2121", "color4": "#df0000"}; client.warnColor = function () {return client.warn[Object.keys(client.warn).random()]}
client.Types = {Ban: "BAN", TempJail: "JAIL", TempMute: "MUTE", TempVMute: "VMUTE", Warn: "WARN", Kick: "KICK", Suspect: "SUSPECT", PermaJail: "PERMA-JAIL", PermaMute: "PERMA-MUTE", PermaVMute: "PERMA-VMUTE"}


client.on("ready", async () => {
    setInterval(() => {
      const oynuyor = conf.BotDurum;
      const index = Math.floor(Math.random() * (oynuyor.length));

      client.user.setActivity(`${oynuyor[index]}`, {
        type: "STREAMING",
        url: "https://www.twitch.tv/thebigpyro06"});

    }, 10000);

    const guild = client.guilds.cache.first();
    const connection = getVoiceConnection(guild.id);
    if (connection) return;

    joinVoiceChannel({
        channelId: conf.BotSesKanal,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: true,
        selfMute : true
    });


    console.log("Bot Aktif");
});

process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
    process.exit(1);
  });
  
  process.on("unhandledRejection", err => {
    console.error("Promise Hatası: ", err);
  });
  const isimler = require("./src/schemas/isimler");
  