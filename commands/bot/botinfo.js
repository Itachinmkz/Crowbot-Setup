const Discord = require('discord.js')
const db = require('quick.db')
const axios = require("axios");
const {
	MessageActionRow,
	MessageButton,
	MessageMenuOption,
	MessageMenu
} = require('discord-buttons');

module.exports = {
	name: 'botinfo',
	aliases: ['infobot', 'uptime'],
	run: async (client, message, args, prefix, color) => {

		if (client.config.owner.includes(message.author.id)) {

            const embed = new Discord.MessageEmbed()

            embed.setTitle(`Informations à propos de : ${client.user.username}`)
            embed.setColor(color)
            .setThumbnail(message.author.avatarURL({ dynamic:true }));
            embed.setTimestamp()
            embed.setFooter(`${client.config.name}`)
            embed.addFields(
                { name: '👑 Owner / Developpeur :', value: 'Krieger', inline: true },
                { name: '🔌 Latence du bot :', value: `\`${client.ws.ping}Ms\`` },
                { name: '🚀 Nombre total de serveurs :', value: `\`${client.guilds.cache.size}\``, inline: true },
                { name: '📗 Version de Node.js :', value: `\`${process.version}\``, inline: true },
                { name: "📚 Version de Discord.js :", value: `\`${Discord.version}\``, inline: true },
                { name: "🟢 Allumé depuis :", value: `<t:${(Date.now()-client.uptime).toString().slice(0, -3)}:R>`, inline: true }, 
            )

            message.channel.send(embed);
        }
    }
}
