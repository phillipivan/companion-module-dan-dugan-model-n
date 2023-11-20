const { InstanceBase, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades.js')
const UpdateActions = require('./actions.js')
const UpdateFeedbacks = require('./feedbacks.js')
const UpdateVariableDefinitions = require('./variables.js')
const config = require('./config')
const variableDefaults = require('./variable-defaults.js')
const util = require('./util')
const tcp = require('./tcp')
const processCmd = require('./processcmd')
const {
	MaxChannelCount,
	GroupCount,
	MatrixCount,
	MatrixSize,
	EndSession,
	duganChannels,
	msgDelay,
} = require('./consts.js')

class DUGAN_AUTOMIXER extends InstanceBase {
	constructor(internal) {
		super(internal)
		Object.assign(this, { ...config, ...util, ...tcp, ...processCmd })
		this.keepAliveTimer = {}
		this.cmdTimer = {}
		this.cmdQueue = []
	}
	async init(config) {
		this.updateStatus('Starting')
		this.config = config
		this.initVariables()
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.setVariableValues(variableDefaults)
		this.setInterativeVariables()
		this.initTCP()
		this.cmdTimer = setTimeout(() => {
			this.processCmdQueue()
		}, msgDelay[this.config.rate])
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy. ID: ' + this.id)
		clearTimeout(this.keepAliveTimer)
		clearTimeout(this.cmdTimer)
		if (this.socket) {
			await this.sendCommand(EndSession)
			this.socket.destroy()
		} else if (this.udp) {
			this.udp.destroy()
		} else {
			this.updateStatus(InstanceStatus.Disconnected)
		}
	}

	setInterativeVariables() {
		let varList = []
		for (let i = 1; i <= MaxChannelCount; i++) {
			varList['channelName' + i] = 'Channel ' + i
			varList['channelWeight' + i] = 0
			varList['channelAmixGain' + i] = 0
			varList['channelInputLevel' + i] = -127.5
			varList['channelOutputLevel' + i] = -127.5
		}
		for (let i = 1; i <= MatrixCount; i++) {
			varList['matrixOutFader' + i] = 0
			varList['matrixOutLevel' + i] = -127.5
			for (let x = 1; x <= MatrixSize; x++) {
				varList['matrix' + i + 'Xpoint' + x] = -96.5
			}
		}
		for (let i = 1; i <= GroupCount; i++) {
			varList['groupNOM' + i] = 1
			varList['groupNOMpeak' + i] = -127.5
			varList['groupAD' + i] = -15
			varList['groupMST' + i] = -15
			varList['groupMSTgain' + i] = -127.5
		}
		this.setVariableValues(varList)
	}

	initVariables() {
		this.log('debug', 'initVariables')
		this.groupCount = GroupCount
		this.matrixCount = MatrixCount
		this.musicInputs = []
		this.matrixSources = []
		this.matrixDestinations = []
		this.channelNames = []
		this.matrixNames = []
		this.groupNames = []
		this.clockSources = []
		this.offsetChannelList = []
		this.sceneList = []
		this.sceneChanged = false
		this.matrixDestinations.push({ id: 0, label: 'No Output' })
		if (this.config.channels == 1) {
			this.config.channels = duganChannels[this.config.model]
		}
		for (let i = 1; i <= this.config.channels; i++) {
			this.matrixSources.push({ id: i, label: 'Automix Channel ' + i })
			this.channelNames.push({ id: i, label: 'Automix Channel ' + i })
		}
		if (this.config.model == 11) {
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
		this.matrixGain = []
		this.matrixMute = []
		this.matrixPolarity = []
		this.matrixXpoint = []
		this.matrixOutputPeak = []
		this.matrixOutput = []
		for (let i = 1; i <= this.matrixCount; i++) {
			this.matrixNames.push({ id: i, label: 'Matrix Bus ' + i })
		}
		for (let i = 0; i <= this.matrixCount; i++) {
			this.matrixGain[i] = 0
			this.matrixMute[i] = 0
			this.matrixPolarity[i] = 0
			this.matrixXpoint[i] = []
			this.matrixOutputPeak[i] = -127.5
			this.matrixOutput[i] = 0
			for (let j = 0; j <= MatrixSize; j++) {
				this.matrixXpoint[i][j] = -96
			}
		}
		this.groupNames.push({ id: 1, label: 'Group A' })
		this.groupNames.push({ id: 2, label: 'Group B' })
		this.groupNames.push({ id: 3, label: 'Group C' })
		this.groupAutomixDepth = []
		this.groupMusicThreshold = []
		this.groupNOMgainlimit = []
		this.groupMute = []
		this.groupPreset = []
		this.groupOverride = []
		this.groupLastHold = []
		this.groupNOMpeak = []
		this.groupMusicPeak = []
		this.groupMusicInput = []
		for (let i = 0; i <= this.groupCount; i++) {
			this.groupAutomixDepth[i] = -15
			this.groupMusicThreshold[i] = -10
			this.groupNOMgainlimit[i] = 1
			this.groupMute[i] = 0
			this.groupPreset[i] = 0
			this.groupOverride[i] = 0
			this.groupLastHold[i] = 0
			this.groupNOMpeak[i] = 0
			this.groupMusicPeak[i] = 0
			this.groupMusicInput[i] = 0
		}
		this.channelsMode = []
		this.channelsPreset = []
		this.channelsBypass = []
		this.channelsOverride = []
		this.channelsWeight = []
		this.channelsNom = []
		this.channelsMusic = []
		this.channelsName = []
		this.channelsGroupAssign = []
		this.channelsAmixGain = []
		this.channelsPresence = []
		this.channelsClip = []
		this.channelsInputPeak = []
		this.channelsOutputPeak = []
		for (let i = 0; i <= this.config.channels; i++) {
			this.channelsMode[i] = 1
			this.channelsPreset[i] = 1
			this.channelsBypass[i] = 0
			this.channelsOverride[i] = 0
			this.channelsWeight[i] = 0
			this.channelsNom[i] = 0
			this.channelsMusic[i] = 0
			this.channelsName[i] = 'Channel ' + i
			this.channelsGroupAssign[i] = 1
			this.channelsAmixGain[i] = -127.5
			this.channelsPresence[i] = false
			this.channelsClip[i] = false
			this.channelsInputPeak[i] = -127.5
			this.channelsOutputPeak[i] = -127.5
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

runEntrypoint(DUGAN_AUTOMIXER, UpgradeScripts)
