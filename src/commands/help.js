module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const data = [];
        const { commands } = message.client;
        const roles = require('../docs/assets/roles.json')

        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join('\n'));
            console.log(commands.map(command => {
              if(command.role) {
                if (command.role.includes('adm') && (
                message.member.roles.cache.has(roles.server.recruit)
                || message.member.roles.cache.has(roles.server.moderator)
                || message.member.roles.cache.has(roles.server.administrator)
                || message.member.roles.cache.has(roles.server.owners)
                || message.member.roles.cache.has(roles.server.bot_manager))) {
                  return command.name
                }
                if (command.role.includes('manager') &&
                message.member.roles.cache.has(roles.server.bot_manager)) {
                  return command.name
                }
              } else {
                return command.name
              }
            }).join('\n'))

            data.push(`\nYou can send \`${process.env.PREFIX}help [command name]\` to get info on a specific command!`);

            return message.author.send(data, { split: true })
            .then(() => {
                if (message.channel.type === 'dm') return;
                message.reply('I\'ve sent you a DM with all my commands!');
            })
            .catch(error => {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
            });
        } else {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) {
                return message.reply('that\'s not a valid command!');
            }

            data.push(`**Name:** ${command.name}`);

            if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
            if (command.description) data.push(`**Description:** ${command.description}`);
            if (command.usage) data.push(`**Usage:** ${process.env.PREFIX}${command.name} ${command.usage}`);

            data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

            message.channel.send(data, { split: true });
        }
	},
};