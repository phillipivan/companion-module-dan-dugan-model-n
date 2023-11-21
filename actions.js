const { Regex } = require('@companion-module/base')
const {
	paramSep,
	grpAval,
	grpBval,
	grpCval,
	toggle,
	noChange,
	MatrixCount,
	MatrixSize,
	GroupCount,
	MaxChannelCount,
} = require('./consts.js')

module.exports = function (self) {
	self.setActionDefinitions({
		channel_mode: {
			name: 'Channel - Mode',
			description: 'Set the mode of a channel',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: 1,
					choices: self.channelNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer channel number',
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
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'CM'
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return false
				}
				if (options.query) {
					cmd += paramSep + chan
				} else {
					cmd += paramSep + chan + paramSep + options.mode
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'CM'
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + chan)
				const chMode = self.channelsMode[chan]
				return {
					...action.options,
					mode: chMode,
				}
			},
		},
		channel_preset: {
			name: 'Channel - Preset',
			description: 'Set the preset of a channel',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: 1,
					choices: self.channelNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer channel number',
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
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'CP'
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return false
				}
				if (options.query) {
					cmd += paramSep + chan
				} else {
					cmd += paramSep + chan + paramSep + options.preset
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'CP'
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + chan)
				const chPreset = self.channelsPreset[chan]
				return {
					...action.options,
					preset: chPreset,
				}
			},
		},
		channel_bypass: {
			name: 'Channel - Bypass',
			description: 'Switch a channel bypass on/off',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: 1,
					choices: self.channelNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer channel number',
				},
				{
					id: 'bypass',
					type: 'dropdown',
					label: 'Bypass',
					default: 1,
					choices: [
						{ id: 0, label: 'On' },
						{ id: 1, label: 'Bypass' },
						{ id: toggle, label: 'Toggle' },
					],
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'BP'
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return false
				}
				if (options.query) {
					cmd += paramSep + chan
				} else if (options.bypass == toggle) {
					cmd += paramSep + chan + paramSep + (self.channelsBypass[Number(chan)] ^ 1)
				} else {
					cmd += paramSep + chan + paramSep + options.bypass
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'BP'
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + chan)
				const chBypass = self.channelsBypass[chan]
				return {
					...action.options,
					bypass: chBypass,
				}
			},
		},
		channel_override: {
			name: 'Channel - Override',
			description: 'Switch a channel override on/off',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: 1,
					choices: self.channelNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer channel number',
				},
				{
					id: 'override',
					type: 'dropdown',
					label: 'Override',
					default: 0,
					choices: [
						{ id: 0, label: 'Normal' },
						{ id: 1, label: 'Override' },
						{ id: toggle, label: 'Toggle' },
					],
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'CO'
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return false
				}
				if (options.query) {
					cmd += paramSep + chan
				} else if (options.override == toggle) {
					cmd += paramSep + chan + paramSep + (self.channelsOverride[Number(chan)] ^ 1)
				} else {
					cmd += paramSep + chan + paramSep + options.override
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'CO'
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + chan)
				const chOverride = self.channelsOverride[chan]
				return {
					...action.options,
					override: chOverride,
				}
			},
		},
		channel_weight: {
			name: 'Channel - Weight',
			description: 'Set the automix weight of a channel',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: 1,
					choices: self.channelNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer channel number',
				},
				{
					id: 'weight',
					type: 'number',
					label: 'Weight',
					default: 0,
					min: -100,
					max: +15,
					range: true,
					step: 0.1,
					required: true,
					regex: Regex.NUMBER,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'CW'
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return false
				}
				if (options.query) {
					cmd += paramSep + chan
				} else {
					cmd += paramSep + chan + paramSep + options.weight
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'CW'
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + chan)
				const chWeight = self.channelsWeight[chan]
				return {
					...action.options,
					weight: chWeight,
				}
			},
		},
		channel_weight_rel: {
			name: 'Channel - Weight, Relative',
			description: 'Adjust automix weight of a channel',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: 1,
					choices: self.channelNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer channel number',
				},
				{
					id: 'weight',
					type: 'number',
					label: 'Weight',
					default: 1,
					min: -6,
					max: +6,
					range: true,
					step: 0.1,
					required: true,
					regex: Regex.NUMBER,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'CW'
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return false
				}
				let weight = self.channelsWeight[options.channel] + options.weight
				let weightRound = weight.toFixed(2)
				if (weightRound < -100) {
					weightRound = -100
				}
				if (weightRound > 15) {
					weightRound = 15
				}
				cmd += paramSep + chan + paramSep + weightRound
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'CW'
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + chan)
				return {
					...action.options,
				}
			},
		},
		channel_music_mode: {
			name: 'Channel - Music Mode',
			description: 'Switch a channel music mode on/off',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: 1,
					choices: self.channelNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer channel number',
				},
				{
					id: 'music',
					type: 'dropdown',
					label: 'Music Mode',
					default: 1,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: 1, label: 'On' },
						{ id: toggle, label: 'Toggle' },
					],
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'MR'
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return false
				}
				if (options.query) {
					cmd += paramSep + chan
				} else if (options.music == toggle) {
					cmd += paramSep + chan + paramSep + (self.channelsMusic[Number(chan)] ^ 1)
				} else {
					cmd += paramSep + chan + paramSep + options.music
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'MR'
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + chan)
				const chMusic = self.channelsMusic[chan]
				return {
					...action.options,
					music: chMusic,
				}
			},
		},
		channel_NOM_mode: {
			name: 'Channel - NOM Mode',
			description: 'Switch a channel NOM mode on/off',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: 1,
					choices: self.channelNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer channel number',
				},
				{
					id: 'nom',
					type: 'dropdown',
					label: 'NOM Mode',
					default: 1,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: 1, label: 'On' },
						{ id: toggle, label: 'Toggle' },
					],
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'NE'
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return false
				}
				if (options.query) {
					cmd += paramSep + chan
				} else if (options.nom == toggle) {
					cmd += paramSep + chan + paramSep + (self.channelsNom[Number(chan)] ^ 1)
				} else {
					cmd += paramSep + chan + paramSep + options.nom
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'NE'
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + chan)
				const chNOM = self.channelsNom[chan]
				return {
					...action.options,
					nom: chNOM,
				}
			},
		},
		channel_group_assign: {
			name: 'Channel - Group Assign',
			description: 'Set the group of a channel',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: 1,
					choices: self.channelNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer channel number',
				},
				{
					id: 'group',
					type: 'dropdown',
					label: 'Group Assignment',
					default: 1,
					choices: self.groupNames,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll the current name',
				},
			],
			callback: ({ options }) => {
				let cmd = 'GA'
				if (options.query) {
					cmd += paramSep + options.channel
				} else {
					cmd += paramSep + options.channel + paramSep + options.group
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'GA'
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + chan)
				const chGroup = self.channelsGroupAssign[chan]
				return {
					...action.options,
					group: chGroup,
				}
			},
		},
		channel_name: {
			name: 'Channel - Name',
			description: 'Name a Channel',
			options: [
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Channel',
					default: 1,
					choices: self.channelNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer channel number',
				},
				{
					id: 'name',
					type: 'textinput',
					label: 'Channel Name',
					default: 'Channel 1',
					required: true,
					Regex: Regex.SOMETHING,
					useVariables: true,
					tooltip: 'Max Length: 15 char',
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll the current name',
				},
			],
			callback: async ({ options }) => {
				let cmd = 'CN'
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return false
				}
				if (options.query) {
					cmd += paramSep + chan
				} else {
					let safeChanName = await self.regexSafeString(await self.parseVariablesInString(options.name))
					if (safeChanName != undefined && safeChanName.length >= 1) {
						cmd += paramSep + chan + paramSep + safeChanName
					} else {
						self.log('warn', 'Not a valid channel name')
						return false
					}
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'CN'
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + chan)
				const chName = self.channelsName[chan]
				return {
					...action.options,
					name: chName,
				}
			},
		},
		group_mute: {
			name: 'Group - Mute',
			description: 'Set the mute state of the groups',
			options: [
				{
					id: 'groupA',
					type: 'dropdown',
					label: 'Group A Mute',
					default: 0,
					choices: [
						{ id: 0, label: 'On' },
						{ id: grpAval, label: 'Mute' },
						{ id: toggle, label: 'Toggle' },
						{ id: noChange, label: 'No Change' },
					],
				},
				{
					id: 'groupB',
					type: 'dropdown',
					label: 'Group B Mute',
					default: 0,
					choices: [
						{ id: 0, label: 'On' },
						{ id: grpBval, label: 'Mute' },
						{ id: toggle, label: 'Toggle' },
						{ id: noChange, label: 'No Change' },
					],
				},
				{
					id: 'groupC',
					type: 'dropdown',
					label: 'Group C Mute',
					default: 0,
					choices: [
						{ id: 0, label: 'On' },
						{ id: grpCval, label: 'Mute' },
						{ id: toggle, label: 'Toggle' },
						{ id: noChange, label: 'No Change' },
					],
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll the group mute state',
				},
			],
			callback: ({ options }) => {
				let cmd = 'SM'
				if (!options.query) {
					let groupMute = 0
					if (options.groupA < toggle) groupMute += options.groupA
					if (options.groupB < toggle) groupMute += options.groupB
					if (options.groupC < toggle) groupMute += options.groupC
					if (options.groupA == toggle) groupMute += self.groupMute[1] ^ grpAval
					if (options.groupB == toggle) groupMute += self.groupMute[2] ^ grpBval
					if (options.groupC == toggle) groupMute += self.groupMute[3] ^ grpCval
					if (options.groupA == noChange) groupMute += self.groupMute[1]
					if (options.groupB == noChange) groupMute += self.groupMute[2]
					if (options.groupC == noChange) groupMute += self.groupMute[3]
					cmd += paramSep + groupMute
				}
				self.addCmdtoQueue(cmd)
			},
			learn: (action) => {
				let cmd = 'SM'
				const grpA = self.groupMute[1]
				const grpB = self.groupMute[2]
				const grpC = self.groupMute[3]
				self.addCmdtoQueue(cmd)
				return {
					...action.options,
					groupA: grpA,
					groupB: grpB,
					groupC: grpC,
				}
			},
		},
		group_preset: {
			name: 'Group - Preset',
			description: 'Set the preset state of the groups',
			options: [
				{
					id: 'groupA',
					type: 'dropdown',
					label: 'Group A Preset',
					default: 0,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: grpAval, label: 'Preset' },
						{ id: toggle, label: 'Toggle' },
						{ id: noChange, label: 'No Change' },
					],
				},
				{
					id: 'groupB',
					type: 'dropdown',
					label: 'Group B Preset',
					default: 0,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: grpBval, label: 'Preset' },
						{ id: toggle, label: 'Toggle' },
						{ id: noChange, label: 'No Change' },
					],
				},
				{
					id: 'groupC',
					type: 'dropdown',
					label: 'Group C Preset',
					default: 0,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: grpCval, label: 'Preset' },
						{ id: toggle, label: 'Toggle' },
						{ id: noChange, label: 'No Change' },
					],
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll the group preset state',
				},
			],
			callback: ({ options }) => {
				let cmd = 'SP'
				if (!options.query) {
					let groupPreset = 0
					if (options.groupA < toggle) groupPreset += options.groupA
					if (options.groupB < toggle) groupPreset += options.groupB
					if (options.groupC < toggle) groupPreset += options.groupC
					if (options.groupA == toggle) groupPreset += self.groupPreset[1] ^ grpAval
					if (options.groupB == toggle) groupPreset += self.groupPreset[2] ^ grpBval
					if (options.groupC == toggle) groupPreset += self.groupPreset[3] ^ grpCval
					if (options.groupA == noChange) groupPreset += self.groupPreset[1]
					if (options.groupB == noChange) groupPreset += self.groupPreset[2]
					if (options.groupC == noChange) groupPreset += self.groupPreset[3]
					cmd += paramSep + groupPreset
				}
				self.addCmdtoQueue(cmd)
			},
			learn: (action) => {
				let cmd = 'SP'
				const grpA = self.groupPreset[1]
				const grpB = self.groupPreset[2]
				const grpC = self.groupPreset[3]
				self.addCmdtoQueue(cmd)
				return {
					...action.options,
					groupA: grpA,
					groupB: grpB,
					groupC: grpC,
				}
			},
		},
		group_override: {
			name: 'Group - Override',
			description: 'Set the Override state of the groups',
			options: [
				{
					id: 'groupA',
					type: 'dropdown',
					label: 'Group A Override',
					default: 0,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: grpAval, label: 'Override' },
						{ id: toggle, label: 'Toggle' },
						{ id: noChange, label: 'No Change' },
					],
				},
				{
					id: 'groupB',
					type: 'dropdown',
					label: 'Group B Override',
					default: 0,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: grpBval, label: 'Override' },
						{ id: toggle, label: 'Toggle' },
						{ id: noChange, label: 'No Change' },
					],
				},
				{
					id: 'groupC',
					type: 'dropdown',
					label: 'Group C Override',
					default: 0,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: grpCval, label: 'Override' },
						{ id: toggle, label: 'Toggle' },
						{ id: noChange, label: 'No Change' },
					],
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll the group over ride state',
				},
			],
			callback: ({ options }) => {
				let cmd = 'SO'
				if (!options.query) {
					let groupOverride = 0
					if (options.groupA < toggle) groupOverride += options.groupA
					if (options.groupB < toggle) groupOverride += options.groupB
					if (options.groupC < toggle) groupOverride += options.groupC
					if (options.groupA == toggle) groupOverride += self.groupOverride[1] ^ grpAval
					if (options.groupB == toggle) groupOverride += self.groupOverride[2] ^ grpBval
					if (options.groupC == toggle) groupOverride += self.groupOverride[3] ^ grpCval
					if (options.groupA == noChange) groupOverride += self.groupOverride[1]
					if (options.groupB == noChange) groupOverride += self.groupOverride[2]
					if (options.groupC == noChange) groupOverride += self.groupOverride[3]
					cmd += paramSep + groupOverride
				}
				self.addCmdtoQueue(cmd)
			},
			learn: (action) => {
				let cmd = 'SO'
				const grpA = self.groupOverride[1]
				const grpB = self.groupOverride[2]
				const grpC = self.groupOverride[3]
				self.addCmdtoQueue(cmd)
				return {
					...action.options,
					groupA: grpA,
					groupB: grpB,
					groupC: grpC,
				}
			},
		},
		group_lasthold: {
			name: 'Group - Last Hold',
			description: 'Set the Last Hold state of the groups',
			options: [
				{
					id: 'groupA',
					type: 'dropdown',
					label: 'Group A Last Hold',
					default: 0,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: grpAval, label: 'Last Hold' },
						{ id: toggle, label: 'Toggle' },
						{ id: noChange, label: 'No Change' },
					],
				},
				{
					id: 'groupB',
					type: 'dropdown',
					label: 'Group B Last Hold',
					default: 0,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: grpBval, label: 'Last Hold' },
						{ id: toggle, label: 'Toggle' },
						{ id: noChange, label: 'No Change' },
					],
				},
				{
					id: 'groupC',
					type: 'dropdown',
					label: 'Group C Last Hold',
					default: 0,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: grpCval, label: 'Last Hold' },
						{ id: toggle, label: 'Toggle' },
						{ id: noChange, label: 'No Change' },
					],
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll the group last hold state',
				},
			],
			callback: ({ options }) => {
				let cmd = 'LH'
				if (!options.query) {
					let groupLasthold = 0
					if (options.groupA < toggle) groupLasthold += options.groupA
					if (options.groupB < toggle) groupLasthold += options.groupB
					if (options.groupC < toggle) groupLasthold += options.groupC
					if (options.groupA == toggle) groupLasthold += self.groupLastHold[1] ^ grpAval
					if (options.groupB == toggle) groupLasthold += self.groupLastHold[2] ^ grpBval
					if (options.groupC == toggle) groupLasthold += self.groupLastHold[3] ^ grpCval
					if (options.groupA == noChange) groupLasthold += self.groupLastHold[1]
					if (options.groupB == noChange) groupLasthold += self.groupLastHold[2]
					if (options.groupC == noChange) groupLasthold += self.groupLastHold[3]
					cmd += paramSep + groupLasthold
				}
				self.addCmdtoQueue(cmd)
			},
			learn: (action) => {
				let cmd = 'LH'
				const grpA = self.groupLastHold[1]
				const grpB = self.groupLastHold[2]
				const grpC = self.groupLastHold[3]
				self.addCmdtoQueue(cmd)
				return {
					...action.options,
					groupA: grpA,
					groupB: grpB,
					groupC: grpC,
				}
			},
		},
		group_automixdepth: {
			name: 'Group - Automix Depth',
			description: 'Set the automix depth of a group',
			options: [
				{
					id: 'group',
					type: 'dropdown',
					label: 'Group',
					default: '1',
					choices: self.groupNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer group number',
				},
				{
					id: 'depth',
					type: 'number',
					label: 'Depth',
					default: -15,
					min: -100,
					max: 0,
					required: true,
					range: true,
					step: 0.1,
					regex: Regex.NUMBER,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll the group automix depth',
				},
			],
			callback: async ({ options }) => {
				let cmd = 'ME' //AD commands also works
				let group = await self.parseVariablesInString(options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', 'an invalid varible has been passed: ' + group)
					return false
				}
				if (options.query) {
					cmd += paramSep + group
				} else {
					cmd += paramSep + group + paramSep + options.depth
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'ME' //AD commands also works
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', 'an invalid varible has been passed: ' + group)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + group)
				const grpAD = self.groupAutomixDepth[group]
				return {
					...action.options,
					depth: grpAD,
				}
			},
		},
		group_automixdepth_rel: {
			name: 'Group - Automix Depth, Relative',
			description: 'Adjust the automix depth of a group',
			options: [
				{
					id: 'group',
					type: 'dropdown',
					label: 'Group',
					default: '1',
					choices: self.groupNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer group number',
				},
				{
					id: 'depth',
					type: 'number',
					label: 'Depth',
					default: 1,
					min: -6,
					max: 6,
					required: true,
					range: true,
					step: 0.1,
					regex: Regex.NUMBER,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'ME' //AD commands also works
				let group = await self.parseVariablesInString(options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', 'an invalid varible has been passed: ' + group)
					return false
				}
				let depth = self.groupAutomixDepth[options.group] + options.depth
				if (depth < -100) {
					depth = -100
				}
				if (depth > 0) {
					depth = 0
				}
				let depthRound = depth.toFixed(2)
				cmd += paramSep + group + paramSep + depthRound
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'ME' //AD commands also works
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', 'an invalid varible has been passed: ' + group)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + group)
				return {
					...action.options,
				}
			},
		},
		group_NOMgainlimit: {
			name: 'Group - NOM Gain Limit',
			description: 'Set the NOM gain limit of a group',
			options: [
				{
					id: 'group',
					type: 'dropdown',
					label: 'Group',
					default: '1',
					choices: self.groupNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer group number',
				},
				{
					id: 'nomgain',
					type: 'number',
					label: 'NOM Gain Limit',
					default: 1,
					min: 1,
					max: 10,
					required: true,
					range: true,
					step: 0.1,
					regex: Regex.NUMBER,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll the group NOM gain limit',
				},
			],
			callback: async ({ options }) => {
				let cmd = 'NL'
				let group = await self.parseVariablesInString(options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', 'an invalid varible has been passed: ' + group)
					return false
				}
				if (options.query) {
					cmd += paramSep + group
				} else {
					cmd += paramSep + group + paramSep + options.nomgain
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'NL'
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', 'an invalid varible has been passed: ' + group)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + group)
				const grpNL = self.groupNOMgainlimit[group]
				return {
					...action.options,
					nomgain: grpNL,
				}
			},
		},
		group_NOMgainlimit_rel: {
			name: 'Group - NOM Gain Limit, Relative',
			description: 'Adjust the NOM gain limit of a group',
			options: [
				{
					id: 'group',
					type: 'dropdown',
					label: 'Group',
					default: '1',
					choices: self.groupNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer group number',
				},
				{
					id: 'nomgain',
					type: 'number',
					label: 'NOM Gain Limit',
					default: 1,
					min: -6,
					max: 6,
					required: true,
					range: true,
					step: 0.1,
					regex: Regex.NUMBER,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'NL'
				let group = await self.parseVariablesInString(options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', 'an invalid varible has been passed: ' + group)
					return false
				}
				let nom = self.groupNOMgainlimit[group] + options.nomgain
				if (nom < 1) {
					nom = 1
				}
				if (nom > 10) {
					nom = 10
				}
				let nomRound = nom.toFixed(2)
				cmd += paramSep + group + paramSep + nomRound
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'NL'
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', 'an invalid varible has been passed: ' + group)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + group)
				return {
					...action.options,
				}
			},
		},
		group_musicthreshold: {
			name: 'Group - Music System Threshold',
			description: 'Set the Music System Threshold of a group',
			options: [
				{
					id: 'group',
					type: 'dropdown',
					label: 'Group',
					default: 1,
					choices: self.groupNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer group number',
				},
				{
					id: 'threshold',
					type: 'number',
					label: 'Music System Threshold',
					default: -10,
					min: -150,
					max: 20,
					required: true,
					range: true,
					step: 0.1,
					regex: Regex.NUMBER,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll the group music system threshold',
				},
			],
			callback: async ({ options }) => {
				let cmd = 'MT'
				let group = await self.parseVariablesInString(options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', 'an invalid varible has been passed: ' + group)
					return false
				}
				if (options.query) {
					cmd += paramSep + group
				} else {
					cmd += paramSep + group + paramSep + options.threshold
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'MT'
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', 'an invalid varible has been passed: ' + group)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + group)
				const grpMT = self.groupMusicThreshold[group]
				return {
					...action.options,
					threshold: grpMT,
				}
			},
		},
		group_musicthreshold_rel: {
			name: 'Group - Music System Threshold, Relative',
			description: 'Adjust the Music System Threshold of a group',
			options: [
				{
					id: 'group',
					type: 'dropdown',
					label: 'Group',
					default: 1,
					choices: self.groupNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer group number',
				},
				{
					id: 'threshold',
					type: 'number',
					label: 'Music System Threshold',
					default: 1,
					min: -6,
					max: 6,
					required: true,
					range: true,
					step: 0.1,
					regex: Regex.NUMBER,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'MT'
				let group = await self.parseVariablesInString(options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', 'an invalid varible has been passed: ' + group)
					return false
				}
				let thres = self.groupMusicThreshold[group] + options.threshold
				if (thres < -150) {
					thres = -150
				}
				if (thres > 20) {
					thres = 20
				}
				let thresRound = thres.toFixed(2)
				cmd += paramSep + group + paramSep + thresRound
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'MT'
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', 'an invalid varible has been passed: ' + group)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + group)
				return {
					...action.options,
				}
			},
		},
		group_musicinput: {
			name: 'Group - Music System Threshold Input',
			description: 'Set the music system Threshold input of a group',
			options: [
				{
					id: 'group',
					type: 'dropdown',
					label: 'Group',
					default: 1,
					choices: self.groupNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer group number',
				},
				{
					id: 'input',
					type: 'dropdown',
					label: 'Music System Threshold Input',
					default: 1,
					choices: self.musicInputs,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer input number 1 - 86',
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll the group music system threshold input',
				},
			],
			callback: async ({ options }) => {
				let cmd = 'MC'
				let group = await self.parseVariablesInString(options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', 'an invalid varible has been passed: ' + group)
					return false
				}
				let input = await self.parseVariablesInString(options.input)
				input = Math.floor(input)
				if (isNaN(input) || input < 1 || input > 86) {
					self.log('warn', 'an invalid varible has been passed: ' + input)
					return false
				}
				if (options.query) {
					cmd += paramSep + group
				} else {
					cmd += paramSep + group + paramSep + input
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'MC'
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', 'an invalid varible has been passed: ' + group)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + group)
				const grpMTinput = self.groupMusicInput[group]
				return {
					...action.options,
					input: grpMTinput,
				}
			},
		},
		matrix_mute: {
			name: 'Matrix - Bus Mute',
			description: 'Mute a Matrix Bus',
			options: [
				{
					id: 'matrix',
					type: 'dropdown',
					label: 'Matrix',
					default: 1,
					choices: self.matrixNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer matrix number',
				},
				{
					id: 'mute',
					type: 'dropdown',
					label: 'Mute',
					default: 0,
					choices: [
						{ id: 0, label: 'On' },
						{ id: 1, label: 'Mute' },
						{ id: toggle, label: 'Toggle' },
					],
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'MXM'
				let matrix = await self.parseVariablesInString(options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', 'an invalid varible has been passed: ' + matrix)
					return false
				}
				let muteState = (await self.matrixMute[matrix]) ^ 1
				if (options.query) {
					cmd += paramSep + matrix
				} else if (options.mute == toggle) {
					cmd += paramSep + matrix + paramSep + muteState
				} else {
					cmd += paramSep + matrix + paramSep + options.mute
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'MXM'
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', 'an invalid varible has been passed: ' + MatrixCount)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + matrix)
				const muteState = self.matrixMute[matrix]
				return {
					...action.options,
					mute: muteState,
				}
			},
		},
		matrix_polarity: {
			name: 'Matrix - Bus Polarity',
			description: 'Change polarity of a Matrix Bus',
			options: [
				{
					id: 'matrix',
					type: 'dropdown',
					label: 'Matrix',
					default: 1,
					choices: self.matrixNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer matrix number',
				},
				{
					id: 'polarity',
					type: 'dropdown',
					label: 'Polarity',
					default: 0,
					choices: [
						{ id: 0, label: 'Normal' },
						{ id: 1, label: 'Reversed' },
						{ id: toggle, label: 'Toggle' },
					],
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'MXP'
				let matrix = await self.parseVariablesInString(options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', 'an invalid varible has been passed: ' + matrix)
					return false
				}
				let polState = (await self.matrixPolarity[matrix]) ^ 1
				if (options.query) {
					cmd += paramSep + matrix
				} else if (options.polarity == toggle) {
					cmd += paramSep + matrix + paramSep + polState
				} else {
					cmd += paramSep + matrix + paramSep + options.polarity
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'MXP'
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', 'an invalid varible has been passed: ' + MatrixCount)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + matrix)
				const polState = self.matrixPolarity[matrix]
				return {
					...action.options,
					polarity: polState,
				}
			},
		},
		matrix_gain: {
			name: 'Matrix - Gain',
			description: 'Set the gain of a Matrix Bus',
			options: [
				{
					id: 'matrix',
					type: 'dropdown',
					label: 'Matrix',
					default: 1,
					choices: self.matrixNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer matrix number',
				},
				{
					id: 'gain',
					type: 'number',
					label: 'Gain',
					default: 0,
					min: -25,
					max: 15,
					required: true,
					range: true,
					step: 0.5,
					regex: Regex.NUMBER,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll the current matrix output gain',
				},
			],
			callback: async ({ options }) => {
				let cmd = 'MXV'
				let matrix = await self.parseVariablesInString(options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', 'an invalid varible has been passed: ' + matrix)
					return false
				}
				if (options.query) {
					cmd += paramSep + matrix
				} else {
					cmd += paramSep + matrix + paramSep + options.gain
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'MXV'
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', 'an invalid varible has been passed: ' + MatrixCount)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + matrix)
				const matrixGain = self.matrixGain[matrix]
				return {
					...action.options,
					gain: matrixGain,
				}
			},
		},
		matrix_gain_rel: {
			name: 'Matrix - Gain, Relative',
			description: 'Adjust the gain of a Matrix Bus',
			options: [
				{
					id: 'matrix',
					type: 'dropdown',
					label: 'Matrix',
					default: 1,
					choices: self.matrixNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer matrix number',
				},
				{
					id: 'gain',
					type: 'number',
					label: 'Gain',
					default: 1,
					min: -6,
					max: 6,
					required: true,
					range: true,
					step: 0.5,
					regex: Regex.NUMBER,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'MXV'
				let matrix = await self.parseVariablesInString(options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', 'an invalid varible has been passed: ' + matrix)
					return false
				}
				let gain = self.matrixGain[matrix] + options.gain
				if (gain < -25) {
					gain = -25
				}
				if (gain > 15) {
					gain = 15
				}
				let gainRound = gain.toFixed(2)
				cmd += paramSep + matrix + paramSep + gainRound
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'MXV'
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', 'an invalid varible has been passed: ' + MatrixCount)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + matrix)
				return {
					...action.options,
				}
			},
		},
		matrix_output: {
			name: 'Matrix - Output',
			description: 'Set the output channel of a Matrix Bus',
			options: [
				{
					id: 'matrix',
					type: 'dropdown',
					label: 'Matrix',
					default: 1,
					choices: self.matrixNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer matrix number',
				},
				{
					id: 'output',
					type: 'dropdown',
					label: 'Output',
					default: 0,
					choices: self.matrixDestinations,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer output number 0 - 64',
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll the matrix output channel',
				},
			],
			callback: async ({ options }) => {
				let cmd = 'MXO'
				let matrix = await self.parseVariablesInString(options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', 'an invalid varible has been passed: ' + matrix)
					return false
				}
				let output = await self.parseVariablesInString(options.output)
				output = Math.floor(output)
				if (isNaN(output) || output < 0 || output > MaxChannelCount + 16) {
					self.log('warn', 'an invalid varible has been passed: ' + matrix)
					return false
				}
				if (options.query) {
					cmd += paramSep + matrix
				} else {
					cmd += paramSep + matrix + paramSep + output
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'MXO'
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', 'an invalid varible has been passed: ' + matrix)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + matrix)
				const matrixOutput = self.matrixOutput[matrix]
				return {
					...action.options,
					output: matrixOutput,
				}
			},
		},
		matrix_crosspoint: {
			name: 'Matrix - Crosspoint',
			description: 'Set the a crosspoint in the matrix',
			options: [
				{
					id: 'matrix',
					type: 'dropdown',
					label: 'Matrix',
					default: 1,
					choices: self.matrixNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer matrix number',
				},
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Input Channel',
					default: 1,
					choices: self.matrixSources,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer channel number',
				},
				{
					id: 'gain',
					type: 'number',
					label: 'Crosspoint Gain',
					default: -96.5,
					min: -96.5,
					max: 0,
					required: true,
					range: true,
					step: 0.5,
					regex: Regex.NUMBER,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll the matrix crosspoint gain',
				},
			],
			callback: async ({ options }) => {
				let cmd = 'OM'
				let matrix = await self.parseVariablesInString(options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', 'an invalid varible has been passed: ' + matrix)
					return false
				}
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > MatrixSize) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return false
				}
				if (options.query) {
					cmd += paramSep + matrix + paramSep + chan
				} else {
					cmd += paramSep + matrix + paramSep + chan + paramSep + options.gain
				}
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'OM'
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', 'an invalid varible has been passed: ' + MatrixCount)
					return undefined
				}
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > MatrixSize) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + matrix + paramSep + chan)
				const matrixXpoint = self.matrixXpoint[matrix][chan]
				return {
					...action.options,
					gain: matrixXpoint,
				}
			},
		},
		matrix_crosspoint_rel: {
			name: 'Matrix - Crosspoint, Relative',
			description: 'Adjust a crosspoint in the matrix',
			options: [
				{
					id: 'matrix',
					type: 'dropdown',
					label: 'Matrix',
					default: 1,
					choices: self.matrixNames,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer matrix number',
				},
				{
					id: 'channel',
					type: 'dropdown',
					label: 'Input Channel',
					default: 1,
					choices: self.matrixSources,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Varible must return an integer channel number',
				},
				{
					id: 'gain',
					type: 'number',
					label: 'Crosspoint Gain',
					default: 1,
					min: -6,
					max: 6,
					required: true,
					range: true,
					step: 0.5,
					regex: Regex.NUMBER,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'OM'
				let matrix = await self.parseVariablesInString(options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', 'an invalid varible has been passed: ' + matrix)
					return false
				}
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > MatrixSize) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return false
				}
				let gain = self.matrixXpoint[options.matrix][options.channel] + options.gain
				if (gain < -96.5) {
					gain = -96.5
				}
				if (gain > 0) {
					gain = 0
				}
				let gainRound = gain.toFixed(2)
				cmd += paramSep + matrix + paramSep + chan + paramSep + gainRound
				self.addCmdtoQueue(cmd)
			},
			learn: async (action) => {
				let cmd = 'OM'
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', 'an invalid varible has been passed: ' + MatrixCount)
					return undefined
				}
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > MatrixSize) {
					self.log('warn', 'an invalid varible has been passed: ' + chan)
					return undefined
				}
				self.addCmdtoQueue(cmd + paramSep + matrix + paramSep + chan)
				return {
					...action.options,
				}
			},
		},
		sc_count: {
			name: 'Scene - Count',
			description: 'Query number of saved scenes',
			options: [
				{
					id: 'info',
					type: 'static-text',
					label: '',
					value: 'Returns number of scenes saved in unit',
				},
			],
			callback: () => {
				let cmd = 'SNC'
				self.addCmdtoQueue(cmd)
			},
		},
		sc_active: {
			name: 'Scene - Active',
			description: 'Query the active scene',
			options: [
				{
					id: 'info',
					type: 'static-text',
					label: '',
					value: 'Returns name of active scene',
				},
			],
			callback: () => {
				let cmd = 'SNA'
				self.addCmdtoQueue(cmd)
			},
		},
		sc_recall: {
			name: 'Scene - Recall',
			description: 'Recall a saved scene',
			options: [
				{
					id: 'name',
					type: 'dropdown',
					label: 'Scene Name',
					choices: self.sceneList,
					default: 'Factory Defaults',
					required: true,
					Regex: Regex.SOMETHING,
					tooltip: 'Max Length: 15 char',
					useVariables: true,
					allowCustom: true,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'SNR'
				let safeSceneName = await self.regexSafeString(await self.parseVariablesInString(options.name))
				if (safeSceneName != undefined && safeSceneName.length >= 1) {
					cmd += paramSep + safeSceneName
					self.addCmdtoQueue(cmd)
				} else {
					self.log('warn', 'Not a valid scene name')
				}
			},
		},
		sc_save: {
			name: 'Scene - Save',
			description: 'Save a scene',
			options: [
				{
					id: 'name',
					type: 'dropdown',
					label: 'Scene Name',
					choices: self.sceneList,
					default: 'New Scene',
					required: true,
					Regex: Regex.SOMETHING,
					tooltip: 'Max Length: 15 char',
					useVariables: true,
					allowCustom: true,
				},
			],
			callback: async ({ options }) => {
				let cmd = 'SNS'
				let safeSceneName = await self.regexSafeString(await self.parseVariablesInString(options.name))
				if (safeSceneName != undefined && safeSceneName.length >= 1) {
					cmd += paramSep + safeSceneName
					self.addCmdtoQueue(cmd)
				} else {
					self.log('warn', 'Not a valid scene name')
				}
			},
		},
		sc_newsave: {
			name: 'Scene - Save New',
			description: 'Save a new scene',
			options: [
				{
					id: 'name',
					type: 'static-text',
					label: 'Scene Name',
					value: 'A default scene name will be written',
				},
			],
			callback: async () => {
				let cmd = 'SNN'
				self.addCmdtoQueue(cmd)
			},
		},
		sc_rename: {
			name: 'Scene - Rename',
			description: 'Rename an existing scene',
			options: [
				{
					id: 'currentname',
					type: 'dropdown',
					label: 'Current Name',
					default: '',
					required: true,
					Regex: Regex.SOMETHING,
					useVariables: true,
					tooltip: 'Max Length: 15 char',
					choices: self.sceneList,
					allowCustom: true,
				},
				{
					id: 'newname',
					type: 'textinput',
					label: 'New Name',
					default: 'New Scene Name',
					required: true,
					Regex: Regex.SOMETHING,
					useVariables: true,
					tooltip: 'Max Length: 15 char',
				},
			],
			callback: async ({ options }) => {
				let cmd = 'SNE'
				let safeSceneNameCurrent = await self.regexSafeString(await self.parseVariablesInString(options.currentname))
				let safeSceneNameNew = await self.regexSafeString(await self.parseVariablesInString(options.newname))

				if (
					safeSceneNameCurrent != undefined &&
					safeSceneNameCurrent.length >= 1 &&
					safeSceneNameNew != undefined &&
					safeSceneNameNew.length >= 1
				) {
					cmd += paramSep + safeSceneNameCurrent + paramSep + safeSceneNameNew
					self.addCmdtoQueue(cmd)
				} else {
					self.log('warn', 'Not a valid scene name')
				}
			},
		},
		sc_delete: {
			name: 'Scene - Delete',
			description: 'Delete an existing scene',
			options: [
				{
					id: 'name',
					type: 'dropdown',
					label: 'Scene Name',
					choices: self.sceneList,
					default: '',
					required: true,
					Regex: Regex.SOMETHING,
					useVariables: true,
					allowCustom: true,
					tooltip: 'Max Length: 15 char. "," ";" Forbidden.',
				},
			],
			callback: async ({ options }) => {
				let cmd = 'SND'
				let safeSceneName = await self.regexSafeString(await self.parseVariablesInString(options.name))
				if (safeSceneName != undefined && safeSceneName.length >= 1) {
					cmd += paramSep + safeSceneName
					self.addCmdtoQueue(cmd)
				} else {
					self.log('warn', 'Not a valid scene name')
				}
			},
		},
		recall_default: {
			name: 'Recall Defaults',
			description: 'Recall default channel or matrix settings',
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Channel or Matrix',
					default: 'FP',
					choices: [
						{ id: 'FP', label: 'Channel Defaults' },
						{ id: 'RM', label: 'Matrix Defaults' },
					],
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(options.mode)
			},
		},
		system_subscribe: {
			name: 'System - Subscribe Unsolicited',
			description: 'Subscribe to unsolicited paramter changes',
			options: [
				{
					id: 'subscribe',
					type: 'dropdown',
					label: 'Subscribe',
					default: 1,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: 1, label: 'On' },
						{ id: 2, label: 'On with metering' },
					],
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: ({ options }) => {
				let cmd = 'SU'
				if (!options.query) {
					cmd += paramSep + options.subscribe
				}
				self.addCmdtoQueue(cmd)
			},
		},
		system_linkgroup: {
			name: 'System - Link Group',
			description: 'Set the link group',
			options: [
				{
					id: 'linkgroup',
					type: 'number',
					label: 'Link Group Address',
					default: 1,
					min: 0,
					max: 254,
					required: true,
					range: true,
					step: 1,
					regex: Regex.NUMBER,
					tooltip: 'Link group parameters are multicast to 237.1.4.<addr>',
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll current link group',
				},
			],
			callback: ({ options }) => {
				let cmd = 'LG'
				if (!options.query) {
					cmd += paramSep + options.linkgroup
				}
				self.addCmdtoQueue(cmd)
			},
		},
		system_clocksource: {
			name: 'System - Clock Source',
			description: 'Set the clock source',
			options: [
				{
					id: 'clock',
					type: 'dropdown',
					label: 'Clock Source',
					default: '0',
					choices: self.clockSources,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll the current name',
				},
			],
			callback: ({ options }) => {
				let cmd = 'CS'
				if (!options.query) {
					cmd += paramSep + options.clock
				}
				self.addCmdtoQueue(cmd)
			},
		},
		system_ADATmirror: {
			name: 'System - ADAT Mirror',
			description: 'Set the number of input channels echoed to ADAT outputs when in Dante mode',
			options: [
				{
					id: 'mirror',
					type: 'dropdown',
					label: 'ADAT mirror',
					default: 1,
					choices: [
						{ id: 1, label: '8 Channels' },
						{ id: 2, label: '16 Channels' },
					],
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: ({ options }) => {
				let cmd = 'AM'
				if (!options.query) {
					cmd += paramSep + options.mirror
				}
				self.addCmdtoQueue(cmd)
			},
		},
		system_automixchannels: {
			name: 'System - Automix Channels',
			description: 'Set the number of dugan automix channels',
			options: [
				{
					id: 'channels',
					type: 'number',
					label: 'Automix Channels',
					default: self.config.channels,
					min: self.MinChannelCount,
					max: self.MaxChannelCount,
					required: true,
					range: true,
					step: 1,
					regex: Regex.NUMBER,
					tooltip: 'Automix Channel Count',
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll current configured automix channels',
				},
			],
			callback: ({ options }) => {
				let cmd = 'CFN'
				if (!options.query) {
					cmd += paramSep + options.channels
				}
				self.addCmdtoQueue(cmd)
			},
		},
		system_channeloffset: {
			name: 'System - Automix Channel Offset',
			description: 'Set the input channel offset',
			options: [
				{
					id: 'offset',
					type: 'dropdown',
					label: 'Input Offset',
					choices: self.offsetChannelList,
					tooltip: 'Input channel mapped to Automix Channel 1',
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll current configured channel offset',
				},
			],
			callback: ({ options }) => {
				let cmd = 'CFS'
				if (!options.query) {
					cmd += paramSep + options.offset
				}
				self.addCmdtoQueue(cmd)
			},
		},
		system_blinkmode: {
			name: 'System - Blink Mode',
			description: 'Set the blink mode',
			options: [
				{
					id: 'blink',
					type: 'dropdown',
					label: 'Blink Mode',
					default: 1,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: 1, label: 'On' },
					],
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: ({ options }) => {
				let cmd = 'BM'
				if (!options.query) {
					cmd += paramSep + options.blink
				}
				self.addCmdtoQueue(cmd)
			},
		},
		system_DHCP: {
			name: 'System - Network DHCP',
			description: 'Set DHCP',
			options: [
				{
					id: 'dhcp',
					type: 'dropdown',
					label: 'DHCP. Requires reboot to take effect',
					default: 1,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: 1, label: 'On' },
					],
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: ({ options }) => {
				let cmd = 'DH'
				if (!options.query) {
					cmd += paramSep + options.dhcp
				}
				self.addCmdtoQueue(cmd)
			},
		},
		query_system: {
			name: 'Query - System',
			description: 'Query system state and write to logs',
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'SC',
					choices: [
						{ id: 'SC', label: 'System Configuration' },
						{ id: 'VE', label: 'Firmware Versions' },
						{ id: 'CC', label: 'Client Connections' },
						{ id: 'HW', label: 'Resource Useage' },
						{ id: 'HR', label: 'Switch Headroom' },
						{ id: 'SF', label: 'Sample Rate' },
						{ id: 'MM', label: 'Master' },
					],
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(options.mode)
			},
		},
		system_name: {
			name: 'System - Name',
			description: 'Set unit name',
			options: [
				{
					id: 'name',
					type: 'textinput',
					label: 'Unit Name',
					default: 'Dugan Model N',
					required: true,
					Regex: Regex.SOMETHING,
					useVariables: true,
					tooltip: 'Max Length: 15 char',
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
					tooltip: 'Query will poll current configured unit name',
				},
			],
			callback: async ({ options }) => {
				let cmd = 'NA'
				if (!options.query) {
					let safeName = await self.regexSafeString(await self.parseVariablesInString(options.name))
					if (safeName != undefined && safeName.length >= 1) {
						cmd += paramSep + safeName
					} else {
						self.log('warn', 'Not a valid name')
						return false
					}
				}
				self.addCmdtoQueue(cmd)
			},
		},
		system_network: {
			name: 'System - Network',
			description: 'Set unit IP, Netmask or Gateway. Requires reboot to take effect',
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Mode',
					default: 'IP',
					choices: [
						{ id: 'IP', label: 'IP Address' },
						{ id: 'NM', label: 'Subnet Mask' },
						{ id: 'GW', label: 'Gateway' },
					],
				},
				{
					id: 'IP',
					type: 'textinput',
					label: 'IP Address',
					default: '192.168.1.1',
					required: true,
					regex: Regex.IP,
				},
			],
			callback: ({ options }) => {
				let cmd = options.mode
				if (!options.query) {
					let ip = options.IP.split('.')
					let cleanIP = []
					for (let i = 0; i < ip.length; i++) {
						cleanIP[i] = parseInt(ip[i])
						if (isNaN(cleanIP[i]) || cleanIP[i] < 0 || cleanIP[i] > 255) {
							self.log('warn', 'Not a valid IP Address, byte: ' + (i + 1) + ' Value:' + cleanIP[i])
							return false
						}
					}
					if (cleanIP.length != 4) {
						self.log('warn', 'Not a valid IP Address, unexpected length')
						return false
					}
					cmd += paramSep + cleanIP[0] + paramSep + cleanIP[1] + paramSep + cleanIP[2] + paramSep + cleanIP[3]
				}
				self.addCmdtoQueue(cmd)
			},
		},
		query_meters: {
			name: 'Metering',
			description: 'Get metering data',
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Meter Type',
					default: 'GS',
					choices: [
						{ id: 'GS', label: 'Channel Status' },
						{ id: 'GSA', label: 'Automix Gains' },
						{ id: 'GSC', label: 'Signal Clip' },
						{ id: 'GSS', label: 'Signal Presence' },
						{ id: 'GSI', label: 'Input Peaks' },
						{ id: 'GSO', label: 'Output Peaks' },
						{ id: 'GSM', label: 'Music Reference Peaks' },
						{ id: 'GSN', label: 'NOM Gain Limits' },
						{ id: 'GSX', label: 'Matrix Output Meters' },
					],
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(options.mode)
			},
		},
		query_bulk_config: {
			name: 'Query - Bulk Config',
			description: 'Get all channel parameters or matrix cross points',
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Channels or Matrix',
					default: 'GP',
					choices: [
						{ id: 'GP', label: 'Channels Parameters' },
						{ id: 'GM', label: 'Matrix Crosspoints' },
					],
				},
			],
			callback: ({ options }) => {
				self.addCmdtoQueue(options.mode)
			},
		},
		query_namelist: {
			name: 'Query - Name List',
			description: 'Query a list of channel or scene names',
			options: [
				{
					id: 'mode',
					type: 'dropdown',
					label: 'Channel or Scenes',
					default: 'CNS',
					choices: [
						{ id: 'CNS', label: 'Channels' },
						{ id: 'SNL', label: 'Scenes' },
					],
				},
				{
					id: 'first',
					type: 'number',
					label: 'First name to recall',
					default: 1,
					min: 1,
					max: self.config.channels,
					step: 1,
					range: true,
				},
				{
					id: 'count',
					type: 'number',
					label: 'Number of names to recall',
					default: self.config.channels,
					min: 1,
					max: self.MaxChannelCount,
					step: 1,
					range: true,
				},
			],
			callback: ({ options }) => {
				let first = Math.floor(options.first)
				let count = Math.floor(options.count)
				self.addCmdtoQueue(options.mode + paramSep + first + paramSep + count)
			},
		},
	})
}
