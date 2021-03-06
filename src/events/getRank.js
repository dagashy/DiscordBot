const fs = require('fs').promises
const guildConfig = require('../docs/assets/guildConfig.json')

module.exports = {
	name: 'getRank',
	description: 'get all ranks at once',
	usage: 'send message and gain level',
	execute: async (idToGet, document, guildIdBase) => {
		let guildId = guildIdBase
		if(guildConfig[guildIdBase].parentGuild.situation) {
			guildId = guildConfig[guildIdBase].parentGuild.id
		}

		const rankFiles = await fs.readdir(`src/docs/ranks/${guildId}`)
			.catch(err => console.log('[#RANKFILES/RANKUPDATE]', err))

		for(const files of rankFiles) {
			const rankToGet = require(`../docs/ranks/${guildId}/${files}`)

			if(!rankToGet.users[idToGet]) {
				rankToGet.users.total++
			}
			rankToGet.users[idToGet] = {}
			rankToGet.users[idToGet].value = 1
			rankToGet.users[idToGet].name = document.server.username
			rankToGet.users[idToGet].username = document.rp.name
			rankToGet.users[idToGet].rank = rankToGet.users.total

			const data = JSON.stringify(rankToGet)
			await fs.writeFile(`src/docs/ranks/${guildId}/${files}`, data)
				.catch(err => console.log(err))

		}
		require('./rankUpdate').execute(guildIdBase)
		console.log(`Get all ranks to: ${document.server.username}`);
	},
}