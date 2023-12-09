const { combineRgb, Regex } = require('@companion-module/base')
const { paramSep, cmd } = require('./consts')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		sceneChanged: {
			name: 'Scene, Has Changed',
			type: 'boolean',
			label: 'Scene, Has Changed',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: () => {
				return self.sceneChanged == 1
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.scene.active)
				self.checkSubscriptionLevel(1)
			},
		},
		matrixLevel: {
			name: 'Matrix Output Level',
			type: 'boolean',
			label: 'Matrix Output Level',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Matrix',
					id: 'matrix',
					default: 1,
					choices: self.matrixNames,
				},
				{
					type: 'number',
					label: 'Less than or equal to',
					id: 'lessThan',
					default: 0,
					max: 0,
					min: -128,
					range: true,
					step: 0.1,
					required: true,
					regex: Regex.NUMBER,
				},
				{
					type: 'number',
					label: 'Greater than or equal to',
					id: 'greaterThan',
					default: -12,
					max: 0,
					min: -128,
					range: true,
					step: 0.1,
					required: true,
					regex: Regex.NUMBER,
				},
			],
			callback: ({ options }) => {
				return (
					self.matrixOutputPeak[options.matrix] <= options.lessThan &&
					self.matrixOutputPeak[options.matrix] >= options.greaterThan
				)
			},
			subscribe: () => {
				if (self.config.model != 11 && self.config.model != 12) {
					self.addCmdtoQueue(cmd.metering.matrixOutput)
				}
				self.checkSubscriptionLevel(1)
			},
		},
		matrixMuted: {
			name: 'Matrix Output Mute',
			type: 'boolean',
			label: 'Matrix Output Mute',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Matrix',
					id: 'matrix',
					default: 1,
					choices: self.matrixNames,
				},
			],
			callback: ({ options }) => {
				return self.matrixMute[options.matrix] == 1
			},
			subscribe: ({ options }) => {
				self.addCmdtoQueue(cmd.matrix.mute + paramSep + options.matrix)
				self.checkSubscriptionLevel(1)
			},
		},
		matrixPolarity: {
			name: 'Matrix Output Polarity',
			type: 'boolean',
			label: 'Matrix Output Polarity',
			defaultStyle: {
				bgcolor: combineRgb(255, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Matrix',
					id: 'matrix',
					default: 1,
					choices: self.matrixNames,
				},
			],
			callback: ({ options }) => {
				if (self.matrixPolarity[options.matrix] == 1) {
					return true
				} else {
					return false
				}
			},
			subscribe: ({ options }) => {
				self.addCmdtoQueue(cmd.matrix.polarity + paramSep + options.matrix)
				self.checkSubscriptionLevel(1)
			},
		},
		channelMode: {
			name: 'Channel Mode',
			type: 'boolean',
			label: 'Channel Mode',
			defaultStyle: {
				bgcolor: combineRgb(0, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 1,
					choices: self.channel_modes,
				},
			],
			callback: ({ options }) => {
				return self.channelsMode[options.channel] == options.mode
			},
			subscribe: ({ options }) => {
				self.addCmdtoQueue(cmd.channel.mode + paramSep + options.channel)
				self.checkSubscriptionLevel(1)
			},
		},
		channelPreset: {
			name: 'Channel Preset',
			type: 'boolean',
			label: 'Channel Preset',
			defaultStyle: {
				bgcolor: combineRgb(0, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
				{
					id: 'preset',
					type: 'dropdown',
					label: 'Preset',
					default: 1,
					choices: self.channel_modes,
				},
			],
			callback: ({ options }) => {
				return self.channelsPreset[options.channel] == options.preset
			},
			subscribe: ({ options }) => {
				self.addCmdtoQueue(cmd.channel.preset + paramSep + options.channel)
				self.checkSubscriptionLevel(1)
			},
		},
		channelBypass: {
			name: 'Channel Bypass',
			type: 'boolean',
			label: 'Channel Bypass',
			defaultStyle: {
				bgcolor: combineRgb(255, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
			],
			callback: ({ options }) => {
				return self.channelsBypass[options.channel] == 1
			},
			subscribe: ({ options }) => {
				self.addCmdtoQueue(cmd.channel.bypass + paramSep + options.channel)
				self.checkSubscriptionLevel(1)
			},
		},
		channelOverride: {
			name: 'Channel Override',
			type: 'boolean',
			label: 'Channel Override',
			defaultStyle: {
				bgcolor: combineRgb(255, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
			],
			callback: ({ options }) => {
				return self.channelsOverride[options.channel] == 1
			},
			subscribe: ({ options }) => {
				self.addCmdtoQueue(cmd.channel.override + paramSep + options.channel)
				self.checkSubscriptionLevel(1)
			},
		},
		channelMusic: {
			name: 'Channel Music Mode',
			type: 'boolean',
			label: 'Channel Music Mode',
			defaultStyle: {
				bgcolor: combineRgb(255, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
			],
			callback: ({ options }) => {
				return self.channelsMusic[options.channel] == 1
			},
			subscribe: ({ options }) => {
				self.addCmdtoQueue(cmd.channel.music + paramSep + options.channel)
				self.checkSubscriptionLevel(1)
			},
		},
		channelNOM: {
			name: 'Channel NOM Mode',
			type: 'boolean',
			label: 'Channel NOM Mode',
			defaultStyle: {
				bgcolor: combineRgb(255, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
			],
			callback: ({ options }) => {
				return self.channelsNom[options.channel] == 1
			},
			subscribe: ({ options }) => {
				self.addCmdtoQueue(cmd.channel.nom + paramSep + options.channel)
				self.checkSubscriptionLevel(1)
			},
		},
		channelGroupAssign: {
			name: 'Channel Group Assignment',
			type: 'boolean',
			label: 'Channel Group Assignment',
			defaultStyle: {
				bgcolor: combineRgb(255, 255, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
				{
					type: 'dropdown',
					label: 'Group',
					id: 'group',
					default: 1,
					choices: self.groupNames,
				},
			],
			callback: ({ options }) => {
				return self.channelsGroupAssign[options.channel] == options.group
			},
			subscribe: ({ options }) => {
				self.addCmdtoQueue(cmd.channel.group + paramSep + options.channel)
				self.checkSubscriptionLevel(1)
			},
		},
		channelClip: {
			name: 'Channel Clip',
			type: 'boolean',
			label: 'Channel Clip',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
			],
			callback: ({ options }) => {
				return self.channelsClip[options.channel]
			},
			subscribe: () => {
				if (self.config.model != 11 && self.config.model != 12) {
					self.addCmdtoQueue(cmd.metering.signalClip)
				}
				self.checkSubscriptionLevel(2)
			},
		},
		channelPresence: {
			name: 'Channel Signal Presence',
			type: 'boolean',
			label: 'Channel Signal Presence',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
			],
			callback: ({ options }) => {
				return self.channelsPresence[options.channel]
			},
			subscribe: () => {
				if (self.config.model != 11 && self.config.model != 12) {
					self.addCmdtoQueue(cmd.metering.signalPresense)
				}
				self.checkSubscriptionLevel(1) // should be 2 if SU behaved properly
			},
		},
		channelInputPeak: {
			name: 'Channel Input Peak Meter',
			type: 'boolean',
			label: 'Channel Input Peak Meter',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
				{
					type: 'number',
					label: 'Less than or equal to',
					id: 'lessThan',
					default: 0,
					max: 0,
					min: -128,
					range: true,
					step: 0.1,
					required: true,
					regex: Regex.NUMBER,
				},
				{
					type: 'number',
					label: 'Greater than or equal to',
					id: 'greaterThan',
					default: -12,
					max: 0,
					min: -128,
					range: true,
					step: 0.1,
					required: true,
					regex: Regex.NUMBER,
				},
			],
			callback: ({ options }) => {
				return (
					self.channelsInputPeak[options.channel] <= options.lessThan &&
					self.channelsInputPeak[options.channel] >= options.greaterThan
				)
			},
			subscribe: () => {
				if (self.config.model != 11 && self.config.model != 12) {
					self.addCmdtoQueue(cmd.metering.inputPeaks)
				}
				self.checkSubscriptionLevel(1) // should be 2 if SU behaved properly
			},
		},
		channelOutputPeak: {
			name: 'Channel Output Peak Meter',
			type: 'boolean',
			label: 'Channel Output Peak Meter',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
				{
					type: 'number',
					label: 'Less than or equal to',
					id: 'lessThan',
					default: 0,
					max: 0,
					min: -128,
					range: true,
					step: 0.1,
					required: true,
					regex: Regex.NUMBER,
				},
				{
					type: 'number',
					label: 'Greater than or equal to',
					id: 'greaterThan',
					default: -12,
					max: 0,
					min: -128,
					range: true,
					step: 0.1,
					required: true,
					regex: Regex.NUMBER,
				},
			],
			callback: ({ options }) => {
				return (
					self.channelsOutputPeak[options.channel] <= options.lessThan &&
					self.channelsOutputPeak[options.channel] >= options.greaterThan
				)
			},
			subscribe: () => {
				if (self.config.model != 11 && self.config.model != 12) {
					self.addCmdtoQueue(cmd.metering.outputPeaks)
				}
				self.checkSubscriptionLevel(1) // should be 2 if SU behaved properly
			},
		},
		channelAmixGain: {
			name: 'Channel Automix Gain Reduction',
			type: 'boolean',
			label: 'Channel Automix Gain Reduction',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
				{
					type: 'number',
					label: 'Less than or equal to',
					id: 'lessThan',
					default: 0,
					max: 0,
					min: -128,
					range: true,
					step: 0.1,
					required: true,
					regex: Regex.NUMBER,
				},
				{
					type: 'number',
					label: 'Greater than or equal to',
					id: 'greaterThan',
					default: -12,
					max: 0,
					min: -128,
					range: true,
					step: 0.1,
					required: true,
					regex: Regex.NUMBER,
				},
			],
			callback: ({ options }) => {
				return (
					self.channelsAmixGain[options.channel] <= options.lessThan &&
					self.channelsAmixGain[options.channel] >= options.greaterThan
				)
			},
			subscribe: () => {
				if (self.config.model != 11 && self.config.model != 12) {
					self.addCmdtoQueue(cmd.metering.automixGain)
				}
				self.checkSubscriptionLevel(1) // should be 2 if SU behaved properly
			},
		},
		groupMute: {
			name: 'Group Mute',
			type: 'boolean',
			label: 'Group Mute',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Group',
					id: 'group',
					default: 1,
					choices: self.groupNames,
				},
			],
			callback: ({ options }) => {
				if (self.groupMute[options.group] != 0) {
					return true
				} else {
					return false
				}
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.group.mute)
				self.checkSubscriptionLevel(1)
			},
		},
		groupPreset: {
			name: 'Group Preset',
			type: 'boolean',
			label: 'Group Preset',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Group',
					id: 'group',
					default: 1,
					choices: self.groupNames,
				},
			],
			callback: ({ options }) => {
				if (self.groupPreset[options.group] != 0) {
					return true
				} else {
					return false
				}
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.group.preset)
				self.checkSubscriptionLevel(1)
			},
		},
		groupOverride: {
			name: 'Group Override',
			type: 'boolean',
			label: 'Group Override',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Group',
					id: 'group',
					default: 1,
					choices: self.groupNames,
				},
			],
			callback: ({ options }) => {
				if (self.groupOverride[options.group] != 0) {
					return true
				} else {
					return false
				}
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.group.override)
				self.checkSubscriptionLevel(1)
			},
		},
		groupLastHold: {
			name: 'Group Last Hold',
			type: 'boolean',
			label: 'Group Last Hold',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Group',
					id: 'group',
					default: 1,
					choices: self.groupNames,
				},
			],
			callback: ({ options }) => {
				if (self.groupLastHold[options.group] != 0) {
					return true
				} else {
					return false
				}
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.group.lastHold)
				self.checkSubscriptionLevel(1)
			},
		},
		groupNOMgain: {
			name: 'Group NOM Gain Reduction',
			type: 'boolean',
			label: 'Group NOM Gain Reduction',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Group',
					id: 'group',
					default: 1,
					choices: self.groupNames,
				},
				{
					type: 'number',
					label: 'Less than or equal to',
					id: 'lessThan',
					default: 0,
					max: 0,
					min: -128,
					range: true,
					step: 0.1,
					required: true,
					regex: Regex.NUMBER,
				},
				{
					type: 'number',
					label: 'Greater than or equal to',
					id: 'greaterThan',
					default: -12,
					max: 0,
					min: -128,
					range: true,
					step: 0.1,
					required: true,
					regex: Regex.NUMBER,
				},
			],
			callback: ({ options }) => {
				return (
					self.groupNOMpeak[options.group] <= options.lessThan &&
					self.groupNOMpeak[options.group] >= options.greaterThan
				)
			},
			subscribe: () => {
				if (self.config.model != 11 && self.config.model != 12) {
					self.addCmdtoQueue(cmd.metering.nomGain)
				}
				self.checkSubscriptionLevel(2)
			},
		},
		groupMusicPeak: {
			name: 'Group Music System Gain Reduction',
			type: 'boolean',
			label: 'Group Music System Gain Reduction',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Group',
					id: 'group',
					default: 1,
					choices: self.groupNames,
				},
				{
					type: 'number',
					label: 'Less than or equal to',
					id: 'lessThan',
					default: 0,
					max: 0,
					min: -128,
					range: true,
					step: 0.1,
					required: true,
					regex: Regex.NUMBER,
				},
				{
					type: 'number',
					label: 'Greater than or equal to',
					id: 'greaterThan',
					default: -12,
					max: 0,
					min: -128,
					range: true,
					step: 0.1,
					required: true,
					regex: Regex.NUMBER,
				},
			],
			callback: ({ options }) => {
				return (
					self.groupMusicPeak[options.group] <= options.lessThan &&
					self.groupMusicPeak[options.group] >= options.greaterThan
				)
			},
			subscribe: () => {
				if (self.config.model != 11 && self.config.model != 12) {
					self.addCmdtoQueue(cmd.metering.musicRef)
				}
				self.checkSubscriptionLevel(1) // should be 2 if SU behaved properly
			},
		},
		groupMusicInput: {
			name: 'Group Music System Threshold Input',
			type: 'boolean',
			label: 'Group Music System Threshold Input',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Group',
					id: 'group',
					default: 1,
					choices: self.groupNames,
				},
				{
					id: 'input',
					type: 'dropdown',
					label: 'Music System Threshold Input',
					default: 1,
					choices: self.musicInputs,
				},
			],
			callback: ({ options }) => {
				return self.groupMusicInput[options.group] == options.input
			},
			subscribe: ({ options }) => {
				self.addCmdtoQueue(cmd.group.musicInput + paramSep + options.group)
				self.checkSubscriptionLevel(1)
			},
			learn: async (feedback) => {
				self.addCmdtoQueue(cmd.group.musicInput + paramSep + feedback.options.group)
				const grpMTinput = self.groupMusicInput[feedback.options.group]
				return {
					...feedback.options,
					input: grpMTinput,
				}
			},
		},
		matrixOutput: {
			name: 'Matrix Output Route',
			type: 'boolean',
			label: 'Matrix Output Route',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Matrix',
					id: 'matrix',
					default: 1,
					choices: self.matrixNames,
				},
				{
					id: 'output',
					type: 'dropdown',
					label: 'Output',
					default: 1,
					choices: self.matrixDestinations,
				},
			],
			callback: ({ options }) => {
				return self.matrixOutput[options.matrix] == options.output
			},
			subscribe: ({ options }) => {
				self.addCmdtoQueue(cmd.matrix.output + paramSep + options.matrix)
				self.checkSubscriptionLevel(1)
			},
			learn: async (feedback) => {
				self.addCmdtoQueue(cmd.matrix.output + paramSep + feedback.options.matrix)
				const matrixOutput = self.matrixOutput[feedback.options.matrix]
				return {
					...feedback.options,
					output: matrixOutput,
				}
			},
		},
	})
}
