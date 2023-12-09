const { Regex } = require('@companion-module/base')
const { duganChannels, automixChannels, cmd, paramSep } = require('./consts.js')
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
			this.subscribeFeedbacks()
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
				this.sendCommand(cmd.system.endSession)
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
		this.addCmdtoQueue(cmd.system.subscribe + paramSep + this.config.subscription)
		clearTimeout(this.meterTimer)
		this.log('info', `meter rate: ${this.config.meterRate}ms`)
		if (this.config.meterRate >= 100) {
			this.meterTimer = setTimeout(() => {
				this.checkMeters()
			}, this.config.meterRate)
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
				min: 0,
				max: 180,
				regex: Regex.NUMBER,
				tooltip: 'Seconds, set to 0 to turn off',
			},
			{
				type: 'dropdown',
				id: 'meterRate',
				label: 'Meter rate',
				choices: this.config_meterInterval,
				default: 1000,
				width: 4,
			},
			{
				type: 'dropdown',
				id: 'model',
				label: 'Dugan Model',
				choices: this.config_duganModels,
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
				choices: this.config_messagingrate,
				default: 1,
				width: 4,
			},
			{
				type: 'dropdown',
				id: 'subscription', // SU Level 2 behaving badly over TCP, thus hidden
				label: 'Unsocilicted Message Subscription',
				choices: this.config_subscribe,
				default: 1,
				width: 4,
				isVisible: () => {
					return true
				},
				tooltip: 'This will be forced on if using feedbacks',
			},
			{
				type: 'number',
				id: 'isTalkingThreshold',
				label: 'Talking Threshold',
				default: -3,
				width: 2,
				min: -24,
				max: 0,
				range: true,
				step: 0.1,
				regex: Regex.NUMBER,
				tooltip: 'Automix gain threshold for Is Talking function',
			},
		]
	},
}
