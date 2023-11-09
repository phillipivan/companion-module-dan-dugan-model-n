const { Regex } = require('@companion-module/base')
const { duganModels, automixChannels } = require('./consts.js')
module.exports = {
	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target Host',
				width: 8,
				regex: Regex.HOSTNAME,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				default: 23,
				width: 4,
				regex: Regex.PORT,
				tooltip: 'Port 23 or 9776',
			},
			//			{
			//				type: 'checkbox',
			//				id: 'udp',
			//				label: 'Use UDP',
			//				default: false,
			//				width: 4,
			//				tooltip: 'Connect via UDP instead of TCP',
			//				isVisible: false,
			//			},
			{
				type: 'number',
				id: 'keepAlive',
				label: 'Poll Interval',
				default: 60,
				width: 2,
				mix: 0,
				max: 3600,
				regex: Regex.NUMBER,
				tooltip: 'Seconds, set to 0 to turn off',
			},
			{
				type: 'dropdown',
				id: 'model',
				label: 'Dugan Model',
				choices: [
					{ id: 11, label: duganModels[11] },
					{ id: 12, label: duganModels[12] },
				],
				default: 11,
				width: 4,
			},
			{
				type: 'dropdown',
				id: 'channels',
				label: 'Automix Channels',
				choices: automixChannels,
				default: 1,
				width: 4,
			},
		]
	},
}
