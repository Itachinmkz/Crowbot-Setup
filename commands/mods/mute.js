const Discord = require("discord.js");
const ms = require("ms");
const db = require("quick.db");

module.exports = {
    name: 'mute',
    aliases: [],
    run: async (client, message, args, prefix, color) => {

        let perm = "";
        message.member.roles.cache.forEach(role => {
            if (db.get(`modsp_${message.guild.id}_${role.id}`)) perm = true;
            if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = true;
            if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true;
        });

        if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {

            if (args[0]) {
                let chx = db.get(`logmod_${message.guild.id}`);
                const logsmod = message.guild.channels.cache.get(chx);

                var user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
                if (!user) return message.channel.send(`Aucun membre trouvé pour: \`${args[0]}\``);
                if (db.get(`mute_${message.guild.id}_${user.id}`) === true) return message.channel.send(`<@${user.id}> est déjà mute`);

                if (user.id === message.author.id) {
                    return message.channel.send(`Vous n'avez pas la permission de **mute** *(vous ne pouvez pas vous mute vous-même)* <@${user.id}>`);
                }
                if (user.roles.highest.position > client.user.id) return message.channel.send(`Je n'ai pas les permissions nécessaires pour **mute** <@${user.id}>`);
                if (db.get(`ownermd_${message.author.id}`) === true) return message.channel.send(`Vous n'avez pas la permission de **mute** <@${user.id}>`);
                if (client.config.owner.includes(user.id)) return message.channel.send(`Vous n'avez pas la permission de **mute** *(vous ne pouvez pas mute un owner)* <@${user.id}>`);
                if (!cooldown[cooldown]) cooldown[message.author.id] = {
                    limit: 0
                };
                var authorcooldown = cooldown[message.author.id];

                if (authorcooldown.limit >= 5) return message.channel.send(`Vous avez atteint votre limite de **mute**, veuillez retenter plus tard!`);

                var reason = args.slice(1).join(" ") || "Aucune raison spécifiée";

                // Timeout pour 47 jours (47 jours * 24 heures * 60 minutes * 60 secondes * 1000 millisecondes)
                const timeoutDuration = 47 * 24 * 60 * 60 * 1000;

                user.timeout(timeoutDuration, `Mute par ${message.author.tag} pour: ${reason}`)
                    .then(() => {
                        db.set(`mute_${message.guild.id}_${user.id}`, true);
                        authorcooldown.limit++;
                        message.channel.send(`${user} a été **mute** pour \`${reason}\``);
                        if (logsmod) logsmod.send(
                            new Discord.MessageEmbed()
                            .setColor(color)
                            .setDescription(`${message.author} a **mute** par ${user} pour \`${reason}\``)
                        );
                        setTimeout(() => {
                            authorcooldown.limit = authorcooldown.limit - 1;
                        }, 120000);
                    })
                    .catch(err => {
                        message.channel.send(`Je n'ai pas pu mute ${user} à cause d'une erreur: ${err}`);
                    });
            }
        }
    }
}
