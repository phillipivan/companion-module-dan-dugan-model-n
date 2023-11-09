const { InstanceBase, runEntrypoint, InstanceStatus, TCPHelper } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades.js')
const UpdateActions = require('./actions.js')
const UpdateFeedbacks = require('./feedbacks.js')
const UpdateVariableDefinitions = require('./variables.js')
const config = require('./config')
const variableDefaults = require('./variable-defaults.js')
const util = require('./util')
const { duganModels, MaxChannelCount, GroupCount, MatrixCount, EndSession, duganChannels } = require('./consts.js')

class DUGAN_MODEL_N extends InstanceBase {
	constructor(internal) {
		super(internal)
		Object.assign(this, { ...config, ...util })
	}
	async init(config) {
		this.config = config
		this.updateStatus('Starting')
		this.initVariables()
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.setVariableValues(variableDefaults)
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
					let cmd = this.regexCmd(strRep)
					let params = strRep.split(',')
					if (cmd == '*,') {
						this.log('warn', strRep)
					} else if (cmd == '*SC,') {
						this.log('info', 'System Configuration: ')
						for (let i = 1; i < params.length; i++) {
							this.log('info', 'Param: ' + i + ' Value: ' + params[i])
						}
						this.setVariableValues({ deviceType: duganModels[params[1]] })
						this.setVariableValues({ hostName: params[2] })
						this.setVariableValues({ serialNumber: params[3] })
						this.setVariableValues({ firmwareVersion: params[4] })
						this.setVariableValues({ fpgaVersion: params[5] })
						this.setVariableValues({ hardwareRevsion: params[6] })
						this.setVariableValues({ macAddress: params[7] })
						this.setVariableValues({ ipAddress: params[8] })
						this.setVariableValues({ netMask: params[9] })
						this.setVariableValues({ gateway: params[10] })
						this.setVariableValues({ dhcp: params[11] })
						this.setVariableValues({ channelCount: params[12] })
						if (this.config.channels != params[12]) {
							this.log(
								'warn',
								'Configured channels: ' +
									this.config.channels +
									' does not match reported channels: ' +
									params[12] +
									' changing config'
							)
							this.config.channels = params[12]
							this.initVariables()
							this.updateActions() // export actions
							this.updateFeedbacks() // export feedbacks
							this.updateVariableDefinitions() // export variable definitions
						}
						if (this.config.model != params[1]) {
							this.log(
								'warn',
								'Configured Model: ' +
									duganModels[this.config.model] +
									' does not match reported model: ' +
									duganModels[params[1]]
							)
						}
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
			this.config.channels = duganChannels[this.config.model]
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
