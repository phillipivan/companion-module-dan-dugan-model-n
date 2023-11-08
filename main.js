const { InstanceBase, Regex, runEntrypoint, InstanceStatus, TCPHelper } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades.js')
const UpdateActions = require('./actions.js')
const UpdateFeedbacks = require('./feedbacks.js')
const UpdateVariableDefinitions = require('./variables.js')
const MaxChannelCount = 64
const MinChannelCount = 8
const GroupCount = 3
const MatrixCount = 6
const EndSession = 'QUIT\r\n'
let automixChannels = []
automixChannels.push({ id: 0, label: 'Unit Default' })
for (let i = MinChannelCount; i <= MaxChannelCount; i++) {
	automixChannels.push({ id: i, label: i + ' Automix Channels' })
}
class DUGAN_MODEL_N extends InstanceBase {
	constructor(internal) {
		super(internal)
	}
	async init(config) {
		this.config = config
		this.updateStatus('Starting')
		this.log(
			'debug',
			'init. ID: ' +
				this.id +
				' Label: ' +
				this.label +
				' IP: ' +
				this.config.host +
				' Port: ' +
				this.config.port +
				' Keep Alive: ' +
				this.config.keepAlive +
				' Model: ' +
				this.config.model +
				' Channels: ' +
				this.config.channels
		)
		this.initVariables()
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.initTCP()
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy. ID: ' + this.id)
		clearTimeout(this.keepAliveTimer)
		if (this.socket) {
			this.sendCommand(EndSession)
			this.socket.destroy()
		} else if (this.udp) {
			this.udp.destroy()
		} else {
			this.updateStatus(InstanceStatus.Disconnected)
		}
	}

	sendCommand(cmd) {
		this.log('debug', 'sendCommand')
		if (cmd !== undefined) {
			if (this.socket !== undefined && this.socket.isConnected) {
				this.log('info', 'Sending Command: ' + cmd)
				this.socket.send(cmd)
				return true
			} else {
				this.log('warn', 'Socket not connected, tried to send: ' + cmd)
			}
		} else {
			this.log('warn', 'Command undefined')
		}
		return false
	}

	pollStatus() {
		this.log('debug', 'pollStatus')
		this.sendCommand('SNC\r\n') //scene count
		this.keepAliveTimer = setTimeout(() => {
			this.pollStatus()
		}, this.config.keepAlive * 1000)
	}

	initTCP() {
		this.log('debug', 'initTCP')
		if (this.socket !== undefined) {
			this.sendCommand(EndSession)
			this.socket.destroy()
			delete this.socket
		}
		if (this.config.host) {
			this.log('debug', 'Creating New Socket')
			this.socket = new TCPHelper(this.config.host, this.config.port)
			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})
			this.socket.on('error', (err) => {
				this.log('error', `Network error: ${err.message}`)
				clearTimeout(this.keepAliveTimer)
			})
			this.socket.on('connect', () => {
				this.log('info', `Connected`)
				this.sendCommand('SC\r\n')
				if (this.config.keepAlive > 0) {
					this.keepAliveTimer = setTimeout(() => {
						this.pollStatus()
					}, this.config.keepAlive * 1000)
				}
			})
			this.socket.on('data', (chunk) => {
				console.log('Data received')
				console.log(chunk)
				let i = 0
				let line = ''
				let offset = 0
				let receivebuffer = ''
				receivebuffer += chunk
				while ((i = receivebuffer.indexOf('\n', offset)) !== -1) {
					line = receivebuffer.substr(offset, i - offset)
					offset = i + 1
					let strRep = line.toString()
					if (strRep.startsWith('*, ')){
						this.log('warn', line.toString())
					} else {
						this.log('info', line.toString())
					}
				}
				receivebuffer = receivebuffer.substr(offset)
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	initVariables() {
		this.log('debug', 'initVariables')
		this.groupCount = GroupCount
		this.matrixCount = MatrixCount
		this.keepAliveTimer = {}
		this.musicInputs = []
		this.matrixSources = []
		this.matrixDestinations = []
		this.channelNames = []
		this.matrixNames = []
		this.groupNames = []
		this.clockSources = []
		this.offsetChannelList = []
		this.matrixDestinations.push({ id: 0, label: 'No Output' })
		if (this.config.channels == 0) {
			this.config.channels = MaxChannelCount
		}
		for (let i = 1; i <= this.config.channels; i++) {
			this.matrixSources.push({ id: i, label: 'Automix Channel ' + i })
			this.channelNames.push({ id: i, label: 'Automix Channel ' + i })
		}
		if (this.config.model == 1) {
			for (let i = 1; i <= 32; i++) {
				this.musicInputs.push({ id: i, label: 'MADI Input ' + i })
			}
			for (let i = 1; i <= MaxChannelCount; i++) {
				this.matrixSources.push({ id: i + MaxChannelCount, label: 'MADI Input ' + i })
				this.matrixDestinations.push({ id: i, label: 'MADI Output ' + i })
			}
			this.clockSources.push({ id: 0, label: 'Madi' })
			for (let i = 1; i <= MaxChannelCount - this.config.channels + 1; i++) {
				this.offsetChannelList.push({ id: i, label: 'Madi Input ' + i })
			}
		} else {
			for (let i = 1; i <= 32; i++) {
				this.musicInputs.push({ id: i, label: 'Dante Input ' + i })
			}
			for (let i = 1; i <= MaxChannelCount; i++) {
				this.matrixSources.push({ id: i + MaxChannelCount, label: 'Dante Input ' + i })
				this.matrixDestinations.push({ id: i, label: 'Dante Output ' + i })
			}
			this.clockSources.push({ id: 0, label: 'Dante' })
			for (let i = 1; i <= MaxChannelCount - this.config.channels + 1; i++) {
				this.offsetChannelList.push({ id: i, label: 'Dante Input ' + i })
			}
		}
		this.clockSources.push({ id: 1, label: 'Word Clock' })
		this.clockSources.push({ id: 2, label: 'Internal' })
		this.clockSources.push({ id: 3, label: 'ADAT' })
		for (let i = 1; i <= 8; i++) {
			this.musicInputs.push({ id: i + MaxChannelCount, label: 'ADAT Input' + i })
			this.matrixSources.push({ id: i + MaxChannelCount * 2, label: 'ADAT Input ' + i })
			this.matrixDestinations.push({ id: i + MaxChannelCount, label: 'ADAT Output ' + i })
		}
		for (let i = 81; i <= 86; i++) {
			this.musicInputs.push({ id: i, label: 'Mix Bus ' + (i - 80) })
		}
		for (let i = 1; i <= this.matrixCount; i++) {
			this.matrixNames.push({ id: i, label: 'Matrix Bus ' + i })
		}
		this.groupNames.push({ id: 1, label: 'Group A' })
		this.groupNames.push({ id: 2, label: 'Group B' })
		this.groupNames.push({ id: 3, label: 'Group C' })
	}

	async configUpdated(config) {
		let oldConfig = this.config
		this.config = config
		if (this.config.channels == 0) {
			this.config.channels = MaxChannelCount
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
			}
		}
	}

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
				label: 'Keep Alive Interval',
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
					{ id: 1, label: 'Model M' },
					{ id: 2, label: 'Model N' },
				],
				default: 2,
				width: 2,
			},
			{
				type: 'dropdown',
				id: 'channels',
				label: 'Automix Channels',
				choices: automixChannels,
				default: 0,
				width: 6,
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(DUGAN_MODEL_N, UpgradeScripts)
