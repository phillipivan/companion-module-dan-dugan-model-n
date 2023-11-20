const { combineRgb, Regex } = require('@companion-module/base')

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
			callback: (_feedback) => {
				if (self.sceneChanged == 1) {
					return true
				} else {
					return false
				}
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
				if (
					self.matrixOutputPeak[options.matrix] <= options.lessThan &&
					self.matrixOutputPeak[options.matrix] >= options.greaterThan
				) {
					return true
				} else {
					return false
				}
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
				if (self.matrixMute[options.matrix] == 1) {
					return true
				} else {
					return false
				}
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
					label: 'channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 1,
					choices: [
						{ id: 0, label: 'Manual' },
						{ id: 1, label: 'Auto' },
						{ id: 2, label: 'Mute' },
					],
				},
			],
			callback: ({ options }) => {
				if (self.channelsMode[options.channel] == options.mode) {
					return true
				} else {
					return false
				}
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
					choices: [
						{ id: 0, label: 'Manual' },
						{ id: 1, label: 'Auto' },
						{ id: 2, label: 'Mute' },
					],
				},
			],
			callback: ({ options }) => {
				if (self.channelsPreset[options.channel] == options.preset) {
					return true
				} else {
					return false
				}
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
					label: 'channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
			],
			callback: ({ options }) => {
				if (self.channelsBypass[options.channel] == 1) {
					return true
				} else {
					return false
				}
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
					label: 'channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
			],
			callback: ({ options }) => {
				if (self.channelsOverride[options.channel] == 1) {
					return true
				} else {
					return false
				}
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
					label: 'channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
			],
			callback: ({ options }) => {
				if (self.channelsMusic[options.channel] == 1) {
					return true
				} else {
					return false
				}
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
					label: 'channel',
					id: 'channel',
					default: 1,
					choices: self.channelNames,
				},
			],
			callback: ({ options }) => {
				if (self.channelsNom[options.channel] == 1) {
					return true
				} else {
					return false
				}
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
					label: 'channel',
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
				if (self.channelsGroupAssign[options.channel] == options.group) {
					return true
				} else {
					return false
				}
			},
		},
		channelClip: {
			name: 'Channel Clip Flag',
			type: 'boolean',
			label: 'Channel Clip Flag',
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
				if (self.channelsClip[options.channel]) {
					return true
				} else {
					return false
				}
			},
		},
		channelPresence: {
			name: 'Channel Signal Presence Flag',
			type: 'boolean',
			label: 'Channel Signal Presence Flag',
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
				if (self.channelsClip[options.channel]) {
					return true
				} else {
					return false
				}
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
				if (
					self.channelsInputPeak[options.channel] <= options.lessThan &&
					self.channelsInputPeak[options.channel] >= options.greaterThan
				) {
					return true
				} else {
					return false
				}
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
				if (
					self.channelsOutputPeak[options.channel] <= options.lessThan &&
					self.channelsOutputPeak[options.channel] >= options.greaterThan
				) {
					return true
				} else {
					return false
				}
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
				if (
					self.channelsAmixGain[options.channel] <= options.lessThan &&
					self.channelsAmixGain[options.channel] >= options.greaterThan
				) {
					return true
				} else {
					return false
				}
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
		},
		groupNOMgain: {
			name: 'Group NOM Gain reduction',
			type: 'boolean',
			label: 'Group NOM Gain reduction',
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
				if (
					self.groupNOMpeak[options.group] <= options.lessThan &&
					self.groupNOMpeak[options.group] >= options.greaterThan
				) {
					return true
				} else {
					return false
				}
			},
		},
		groupMusicPeak: {
			name: 'Group Music Gain reduction',
			type: 'boolean',
			label: 'Group Music Gain reduction',
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
				if (
					self.groupMusicPeak[options.group] <= options.lessThan &&
					self.groupMusicPeak[options.group] >= options.greaterThan
				) {
					return true
				} else {
					return false
				}
			},
		},
	})
}
