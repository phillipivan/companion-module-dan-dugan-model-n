const { Regex } = require('@companion-module/base')
const { duganModels, duganChannels, automixChannels, EndSession } = require('./consts.js')
module.exports = {
	async configUpdated(config) {
		let oldConfig = this.config
		this.config = config
		if (this.config.channels == 1) {
			this.config.channels = duganChannels[this.config.model]
		}
		if (oldConfig.keepAlive != this.config.keepAlive) {
			clearTimeout(this.keepAliveTimer)
			if (this.config.keepAlive > 0) {
				this.keepAliveTimer = setTimeout(() => {
					this.pollStatus()
				}, this.config.keepAlive * 1000)
			}
		}
		if (oldConfig.model != this.config.model || oldConfig.channels != this.config.channels) {
			this.initVariables()
			this.updateActions() // export actions
			this.updateFeedbacks() // export feedbacks
			this.updateVariableDefinitions() // export variable definitions
			//this.setVariableValues(variableDefaults)
		}
		if (oldConfig.host != this.config.host || oldConfig.port != this.config.port || oldConfig.udp != this.config.udp) {
			//changed connection
			if (this.udp) {
				clearTimeout(this.keepAliveTimer)
				this.udp.destroy()
				delete this.udp
			}
			if (this.socket) {
				this.log('debug', 'deleting socket')
				clearTimeout(this.keepAliveTimer)
				this.sendCommand(EndSession)
				this.socket.destroy()
				delete this.socket
			}
			if (this.config.udp) {
				// init UDP connection
			} else {
				this.initTCP()
				this.initVariables()
				this.updateActions() // export actions
				this.updateFeedbacks() // export feedbacks
				this.updateVariableDefinitions() // export variable definitions
				//this.setVariableValues(variableDefaults)
			}
		}
	},
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
			{
				type: 'checkbox', //not yet implemented, thus hidden
				id: 'udp',
				label: 'Use UDP',
				default: false,
				width: 4,
				tooltip: 'Connect via UDP instead of TCP',
				isVisible: () => {
					return false
				},
			},
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
			{
				type: 'dropdown',
				id: 'rate',
				label: 'Messaging rate',
				choices: [
					{ id: 0, label: 'Fast' },
					{ id: 1, label: 'Medium' },
					{ id: 2, label: 'Slow' },
					{ id: 3, label: 'Very Slow' },
				],
				default: 0,
				width: 4,
			},
		]
	},
}
