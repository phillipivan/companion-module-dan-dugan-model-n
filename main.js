const { InstanceBase, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades.js')
const UpdateActions = require('./actions.js')
const UpdateFeedbacks = require('./feedbacks.js')
const UpdateVariableDefinitions = require('./variables.js')
const config = require('./config')
const variableDefaults = require('./variable-defaults.js')
const util = require('./util')
const tcp = require('./tcp.js')
const { MaxChannelCount, GroupCount, MatrixCount, EndSession, duganChannels } = require('./consts.js')

class DUGAN_MODEL_N extends InstanceBase {
	constructor(internal) {
		super(internal)
		Object.assign(this, { ...config, ...util, ...tcp })
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
