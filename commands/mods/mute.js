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

                if (user.id === message.author.id) {
                    return message.channel.send(`Vous n'avez pas la permission de **mute** *(vous ne pouvez pas vous mute vous-même)* <@${user.id}>`);
                }

                if (user.roles.highest.position > client.user.id) return message.channel.send(`Je n'ai pas les permissions nécessaires pour **mute** <@${user.id}>`);

                if (!cooldown[cooldown]) cooldown[message.author.id] = {
                    limit: 0
                };
                var authorcooldown = cooldown[message.author.id];

                if (authorcooldown.limit >= 5) return message.channel.send(`Vous avez atteint votre limite de **mute**, veuillez retenter plus tard!`);

                var reason = args.slice(1).join(" ") || "Aucune raison spécifiée";
                var time = ms(args[1]);

                if (!time) return message.channel.send(`Durée incorrecte: \`${args[1]}\``);

                const timeoutDuration = time;

                try {
                    await user.timeout(timeoutDuration, `Mute par ${message.author.tag} pour: ${reason}`);
                    db.set(`mute_${message.guild.id}_${user.id}`, true);
                    authorcooldown.limit++;
                    message.channel.send(`${user} a été **mute** pour \`${ms(timeoutDuration, { long: true })}\` pour \`${reason}\``);
                    
                    if (logsmod) logsmod.send(
                        new Discord.MessageEmbed()
                        .setColor(color)
                        .setDescription(`${message.author} a **mute** ${user} pour \`${ms(timeoutDuration, { long: true })}\` pour \`${reason}\``)
                    );

                    setTimeout(() => {
                        db.set(`mute_${message.guild.id}_${user.id}`, false);
                    }, timeoutDuration);

                    setTimeout(() => {
                        authorcooldown.limit = authorcooldown.limit - 1;
                    }, 120000);

                } catch (err) {
                    console.error('Erreur lors de l’application du timeout:', err);
                    message.channel.send(`Je n'ai pas pu mute ${user} à cause d'une erreur: ${err}`);
                }
            } else {
                message.channel.send("Veuillez spécifier un utilisateur à mute.");
            }
        } else {
            message.channel.send("Vous n'avez pas les permissions nécessaires pour utiliser cette commande.");
        }
    }
}
