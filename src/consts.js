export const regexpCmd = new RegExp(/^([*])([a-zA-Z]{0,3})([,])/g)
export const regexpSafeString = new RegExp(/^[^,*;:]{1,16}/g)
export const msgDelay = [55, 60, 70, 100] //Dugan advice is 50ms minimum, but have often crashed unit at that rate
export const meterCommands = [cmd.metering.channelStatus] //metering commands issued each meterInterval
export const duganModels = [
	'0',
	'1',
	'2',
	'3',
	'Model-E1',
	'Dugan-MY16',
	'Model-E1A',
	'Model-E2',
	'Model-E3',
	'Model-VN',
	'10',
	'Model-M',
	'Model-N',
]
export const duganChannels = [8, 8, 8, 8, 8, 16, 8, 28, 32, 16, 8, 64, 64]
export const MaxChannelCount = 64
export const MinChannelCount = 8
export const GroupCount = 3
export const grpAval = 1
export const grpBval = 2
export const grpCval = 4
export const toggle = 10
export const noChange = 11
export const MatrixCount = 6
export const MatrixSize = 144
export const EOM = '\r\n'
export const SOM = '*'
export const paramSep = ',' //seperator between parameters
export const cmdSep = ';' //seperator between responses when multiple sent in 1 message
export const cmdOnConnect = [
	cmd.system.config,
	cmd.system.firmware,
	cmd.system.blinkMode,
	cmd.system.resourceUseage,
	cmd.system.switchHeadroom,
	cmd.scene.count,
	cmd.scene.active,
	cmd.system.linkGroup,
	cmd.system.clock,
	cmd.system.adatMirror,
	cmd.system.connections,
	cmd.system.sampleRate,
	cmd.system.master,
	cmd.system.channelOffset,
	cmd.system.automixChannels,
] //queries to be made on initial connection
export const cmdOnPollInterval = [cmd.scene.active, cmd.scene.count] //queries to be made each poll interval
export const errSyntax1 = 'Error: syntax'
export const errSyntax2 = 'ERROR: syntax'
export const errRange = 'Error: Channel number out of range'
export const welcomeMessageM = 'Welcome to Dugan Model M Server.'
export const welcomeMessageN = 'Welcome to Dugan Model N Server.'
export const sampleRate = ['48kHz', '96kHz']
export const adatMirror = ['0 Channels', '8 Channels', '16 Channels']
export const clockSources = ['Dante/Madi', 'Word Clock', 'Internal', 'ADAT']
export let automixChannels = []
automixChannels.push({ id: 1, label: 'Unit Default' })
for (let i = MinChannelCount; i <= MaxChannelCount; i++) {
	automixChannels.push({ id: i, label: i + ' Automix Channels' })
}
export const cmd = {
	channel: {
		mode: 'CM',
		preset: 'CP',
		bypass: 'BP',
		override: 'CO',
		weight: 'CW',
		music: 'MR',
		nom: 'NE',
		group: 'GA',
		name: 'CN',
		nameList: 'CNS',
		bulkParams: 'GP',
	},
	group: {
		mute: 'SM',
		preset: 'SP',
		override: 'SO',
		lastHold: 'LH',
		automixDepth: 'ME',
		automixDepthAlt: 'AD',
		nomGainLimit: 'NL',
		musicThreshold: 'MT',
		musicInput: 'MC',
	},
	matrix: {
		mute: 'MXM',
		polarity: 'MXP',
		gain: 'MXV',
		output: 'MXO',
		crosspoint: 'OM',
		defaults: 'RM',
		bulkParams: 'GM',
	},
	metering: {
		channelStatus: 'GS',
		automixGain: 'GSA',
		signalClip: 'GSC',
		signalPresense: 'GSS',
		signalPresenseAlt: 'GSP',
		inputPeaks: 'GSI',
		outputPeaks: 'GSO',
		musicRef: 'GSM',
		nomGain: 'GSN',
		matrixOutput: 'GSX',
	},
	scene: {
		count: 'SNC',
		active: 'SNA',
		recall: 'SNR',
		save: 'SNS',
		saveNew: 'SNN',
		rename: 'SNE',
		delete: 'SND',
		defaults: 'FP',
		nameList: 'SNL',
	},
	system: {
		subscribe: 'SU',
		linkGroup: 'LG',
		clock: 'CS',
		adatMirror: 'AM',
		automixChannels: 'CFN',
		channelOffset: 'CFS',
		blinkMode: 'BM',
		dhcp: 'DH',
		ip: 'IP',
		netmask: 'NM',
		gateway: 'GW',
		name: 'NA',
		config: 'SC',
		firmware: 'VE',
		connections: 'CC',
		resourceUseage: 'HW',
		switchHeadroom: 'HR',
		sampleRate: 'SF',
		master: 'MM',
		endSession: 'QUIT',
		ping: 'PN',
		pd: 'PD',
	},
}
