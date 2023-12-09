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
	cmd,
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
					choices: self.channel_modes,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let cmdTx = cmd.channel.mode
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return false
				}
				if (options.query) {
					cmdTx += paramSep + chan
				} else {
					cmdTx += paramSep + chan + paramSep + options.mode
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				const chMode = self.channelsMode[chan]
				return {
					...action.options,
					mode: chMode,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.channel.mode
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + chan)
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
					choices: self.channel_modes,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let cmdTx = cmd.channel.preset
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return false
				}
				if (options.query) {
					cmdTx += paramSep + chan
				} else {
					cmdTx += paramSep + chan + paramSep + options.preset
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				const chPreset = self.channelsPreset[chan]
				return {
					...action.options,
					preset: chPreset,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.channel.preset
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + chan)
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
					choices: self.channel_bypass,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let cmdTx = cmd.channel.bypass
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return false
				}
				if (options.query) {
					cmdTx += paramSep + chan
				} else if (options.bypass == toggle) {
					cmdTx += paramSep + chan + paramSep + (self.channelsBypass[Number(chan)] ^ 1)
				} else {
					cmdTx += paramSep + chan + paramSep + options.bypass
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				const chBypass = self.channelsBypass[chan]
				return {
					...action.options,
					bypass: chBypass,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.channel.bypass
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + chan)
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
					choices: self.channel_override,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let cmdTx = cmd.channel.override
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return false
				}
				if (options.query) {
					cmdTx += paramSep + chan
				} else if (options.override == toggle) {
					cmdTx += paramSep + chan + paramSep + (self.channelsOverride[Number(chan)] ^ 1)
				} else {
					cmdTx += paramSep + chan + paramSep + options.override
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				const chOverride = self.channelsOverride[chan]
				return {
					...action.options,
					override: chOverride,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.channel.override
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + chan)
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
					id: 'useVar',
					type: 'checkbox',
					label: 'Use Variable',
					default: false,
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
					isVisible: (options) => {
						return options.useVar === false
					},
				},
				{
					id: 'weightVar',
					type: 'textinput',
					label: 'Weight - Variable',
					default: '',
					useVariables: true,
					regex: Regex.SOMETHING,
					isVisible: (options) => {
						return options.useVar === true
					},
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let cmdTx = cmd.channel.weight
				let weightVar = Number(await self.parseVariablesInString(options.weightVar))
				weightVar = weightVar.toFixed(2)
				let chan = await self.parseVariablesInString(options.channel)
				let weight = 0
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return false
				}
				if (options.useVar) {
					if (isNaN(weightVar)) {
						return undefined
					}
					weight = weightVar > 15 ? 15 : weightVar
					weight = weightVar < -100 ? -100 : weightVar
				} else {
					weight = options.weight
				}
				if (options.query) {
					cmdTx += paramSep + chan
				} else {
					cmdTx += paramSep + chan + paramSep + weight
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				const chWeight = self.channelsWeight[chan]
				return {
					...action.options,
					weight: chWeight,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.channel.weight
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + chan)
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
				let cmdTx = cmd.channel.weight
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
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
				cmdTx += paramSep + chan + paramSep + weightRound
				self.addCmdtoQueue(cmdTx)
			},
			subscribe: async (action) => {
				let cmdTx = cmd.channel.weight
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + chan)
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
					choices: self.channel_offOnToggle,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let cmdTx = cmd.channel.music
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return false
				}
				if (options.query) {
					cmdTx += paramSep + chan
				} else if (options.music == toggle) {
					cmdTx += paramSep + chan + paramSep + (self.channelsMusic[Number(chan)] ^ 1)
				} else {
					cmdTx += paramSep + chan + paramSep + options.music
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				const chMusic = self.channelsMusic[chan]
				return {
					...action.options,
					music: chMusic,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.channel.music
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + chan)
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
					choices: self.channel_offOnToggle,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: async ({ options }) => {
				let cmdTx = cmd.channel.nom
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return false
				}
				if (options.query) {
					cmdTx += paramSep + chan
				} else if (options.nom == toggle) {
					cmdTx += paramSep + chan + paramSep + (self.channelsNom[Number(chan)] ^ 1)
				} else {
					cmdTx += paramSep + chan + paramSep + options.nom
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				const chNOM = self.channelsNom[chan]
				return {
					...action.options,
					nom: chNOM,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.channel.nom
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + chan)
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
				let cmdTx = cmd.channel.group
				if (options.query) {
					cmdTx += paramSep + options.channel
				} else {
					cmdTx += paramSep + options.channel + paramSep + options.group
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				const chGroup = self.channelsGroupAssign[chan]
				return {
					...action.options,
					group: chGroup,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.channel.group
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + chan)
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
				let cmdTx = cmd.channel.name
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return false
				}
				if (options.query) {
					cmdTx += paramSep + chan
				} else {
					let safeChanName = await self.regexSafeString(await self.parseVariablesInString(options.name))
					if (safeChanName != undefined && safeChanName.length >= 1) {
						cmdTx += paramSep + chan + paramSep + safeChanName
					} else {
						self.log('warn', 'Not a valid channel name')
						return false
					}
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				const chName = self.channelsName[chan]
				return {
					...action.options,
					name: chName,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.channel.name
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > self.config.channels) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + chan)
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
					choices: self.groupA_mute,
				},
				{
					id: 'groupB',
					type: 'dropdown',
					label: 'Group B Mute',
					default: 0,
					choices: self.groupB_mute,
				},
				{
					id: 'groupC',
					type: 'dropdown',
					label: 'Group C Mute',
					default: 0,
					choices: self.groupC_mute,
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
				let cmdTx = cmd.group.mute
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
					cmdTx += paramSep + groupMute
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: (action) => {
				const grpA = self.groupMute[1]
				const grpB = self.groupMute[2]
				const grpC = self.groupMute[3]
				return {
					...action.options,
					groupA: grpA,
					groupB: grpB,
					groupC: grpC,
				}
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.group.mute)
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
					choices: self.groupA_preset,
				},
				{
					id: 'groupB',
					type: 'dropdown',
					label: 'Group B Preset',
					default: 0,
					choices: self.groupB_preset,
				},
				{
					id: 'groupC',
					type: 'dropdown',
					label: 'Group C Preset',
					default: 0,
					choices: self.groupC_preset,
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
				let cmdTx = cmd.group.preset
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
					cmdTx += paramSep + groupPreset
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: (action) => {
				const grpA = self.groupPreset[1]
				const grpB = self.groupPreset[2]
				const grpC = self.groupPreset[3]
				return {
					...action.options,
					groupA: grpA,
					groupB: grpB,
					groupC: grpC,
				}
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.group.preset)
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
					choices: self.groupA_override,
				},
				{
					id: 'groupB',
					type: 'dropdown',
					label: 'Group B Override',
					default: 0,
					choices: self.groupB_override,
				},
				{
					id: 'groupC',
					type: 'dropdown',
					label: 'Group C Override',
					default: 0,
					choices: self.groupC_override,
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
				let cmdTx = cmd.group.override
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
					cmdTx += paramSep + groupOverride
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: (action) => {
				const grpA = self.groupOverride[1]
				const grpB = self.groupOverride[2]
				const grpC = self.groupOverride[3]
				return {
					...action.options,
					groupA: grpA,
					groupB: grpB,
					groupC: grpC,
				}
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.group.override)
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
					choices: self.groupA_lasthold,
				},
				{
					id: 'groupB',
					type: 'dropdown',
					label: 'Group B Last Hold',
					default: 0,
					choices: self.groupB_lasthold,
				},
				{
					id: 'groupC',
					type: 'dropdown',
					label: 'Group C Last Hold',
					default: 0,
					choices: self.groupC_lasthold,
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
				let cmdTx = cmd.group.lastHold
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
					cmdTx += paramSep + groupLasthold
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: (action) => {
				const grpA = self.groupLastHold[1]
				const grpB = self.groupLastHold[2]
				const grpC = self.groupLastHold[3]
				return {
					...action.options,
					groupA: grpA,
					groupB: grpB,
					groupC: grpC,
				}
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.group.lastHold)
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
					id: 'useVar',
					type: 'checkbox',
					label: 'Use Variable',
					default: false,
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
					isVisible: (options) => {
						return options.useVar === false
					},
				},
				{
					id: 'depthVar',
					type: 'textinput',
					label: 'Depth - Variable',
					default: '',
					useVariables: true,
					regex: Regex.SOMETHING,
					isVisible: (options) => {
						return options.useVar === true
					},
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
				let cmdTx = cmd.group.automixDepth //AD commands also works
				let group = await self.parseVariablesInString(options.group)
				let depthVar = Number(await self.parseVariablesInString(options.depthVar))
				depthVar = depthVar.toFixed(2)
				let depth = 0
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
					return false
				}
				if (options.useVar) {
					if (isNaN(depthVar)) {
						return undefined
					}
					depth = depthVar > 0 ? 0 : depthVar
					depth = depthVar < -100 ? -100 : depthVar
				} else {
					depth = options.depth
				}
				if (options.query) {
					cmdTx += paramSep + group
				} else {
					cmdTx += paramSep + group + paramSep + depth
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
					return undefined
				}
				const grpAD = self.groupAutomixDepth[group]
				return {
					...action.options,
					depth: grpAD,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.group.automixDepth //AD commands also works
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + group)
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
				let cmdTx = cmd.group.automixDepth //AD commands also works
				let group = await self.parseVariablesInString(options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
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
				cmdTx += paramSep + group + paramSep + depthRound
				self.addCmdtoQueue(cmdTx)
			},
			subscribe: async (action) => {
				let cmdTx = cmd.group.automixDepth //AD commands also works
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + group)
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
					id: 'useVar',
					type: 'checkbox',
					label: 'Use Variable',
					default: false,
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
					isVisible: (options) => {
						return options.useVar === false
					},
				},
				{
					id: 'nomVar',
					type: 'textinput',
					label: 'NOM Gain Limit - Variable',
					default: '',
					useVariables: true,
					regex: Regex.SOMETHING,
					isVisible: (options) => {
						return options.useVar === true
					},
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
				let cmdTx = cmd.group.nomGainLimit
				let nomVar = Number(await self.parseVariablesInString(options.nomVar))
				nomVar = nomVar.toFixed(2)
				let nom = 0
				let group = await self.parseVariablesInString(options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
					return false
				}
				if (options.useVar) {
					if (isNaN(nomVar)) {
						return undefined
					}
					nom = nomVar > 10 ? 10 : nomVar
					nom = nomVar < 1 ? 1 : nomVar
				} else {
					nom = options.nomgain
				}
				if (options.query) {
					cmdTx += paramSep + group
				} else {
					cmdTx += paramSep + group + paramSep + nom
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
					return undefined
				}
				const grpNL = self.groupNOMgainlimit[group]
				return {
					...action.options,
					nomgain: grpNL,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.group.nomGainLimit
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + group)
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
				let cmdTx = cmd.group.nomGainLimit
				let group = await self.parseVariablesInString(options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
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
				cmdTx += paramSep + group + paramSep + nomRound
				self.addCmdtoQueue(cmdTx)
			},
			subscribe: async (action) => {
				let cmdTx = cmd.group.nomGainLimit
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + group)
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
					id: 'useVar',
					type: 'checkbox',
					label: 'Use Variable',
					default: false,
				},
				{
					id: 'threshold',
					type: 'number',
					label: 'Music System Threshold',
					default: -10,
					min: -100,
					max: 15,
					required: true,
					range: true,
					step: 0.1,
					regex: Regex.NUMBER,
					isVisible: (options) => {
						return options.useVar === false
					},
				},
				{
					id: 'thresholdVar',
					type: 'textinput',
					label: 'Music System Threshold - Variable',
					default: '',
					useVariables: true,
					regex: Regex.SOMETHING,
					isVisible: (options) => {
						return options.useVar === true
					},
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
				let cmdTx = cmd.group.musicThreshold
				let threshVar = Number(await self.parseVariablesInString(options.thresholdVar))
				threshVar = threshVar.toFixed(2)
				let threshold = 0
				let group = await self.parseVariablesInString(options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
					return false
				}
				if (options.useVar) {
					if (isNaN(threshVar)) {
						return undefined
					}
					threshold = threshVar > 15 ? 15 : threshVar
					threshold = threshVar < -100 ? -100 : threshVar
				} else {
					threshold = options.threshold
				}
				if (options.query) {
					cmdTx += paramSep + group
				} else {
					cmdTx += paramSep + group + paramSep + threshold
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
					return undefined
				}
				const grpMT = self.groupMusicThreshold[group]
				return {
					...action.options,
					threshold: grpMT,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.group.musicThreshold
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + group)
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
				let cmdTx = cmd.group.musicThreshold
				let group = await self.parseVariablesInString(options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
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
				cmdTx += paramSep + group + paramSep + thresRound
				self.addCmdtoQueue(cmdTx)
			},
			subscribe: async (action) => {
				let cmdTx = cmd.group.musicThreshold
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + group)
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
				let cmdTx = cmd.group.musicInput
				let group = await self.parseVariablesInString(options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
					return false
				}
				let input = await self.parseVariablesInString(options.input)
				input = Math.floor(input)
				if (isNaN(input) || input < 1 || input > 86) {
					self.log('warn', `an invalid varible has been passed: ${input}`)
					return false
				}
				if (options.query) {
					cmdTx += paramSep + group
				} else {
					cmdTx += paramSep + group + paramSep + input
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
					return undefined
				}
				const grpMTinput = self.groupMusicInput[group]
				return {
					...action.options,
					input: grpMTinput,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.group.musicInput
				let group = await self.parseVariablesInString(action.options.group)
				group = Math.floor(group)
				if (isNaN(group) || group < 1 || group > GroupCount) {
					self.log('warn', `an invalid varible has been passed: ${group}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + group)
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
				let cmdTx = cmd.matrix.mute
				let matrix = await self.parseVariablesInString(options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${matrix}`)
					return false
				}
				let muteState = (await self.matrixMute[matrix]) ^ 1
				if (options.query) {
					cmdTx += paramSep + matrix
				} else if (options.mute == toggle) {
					cmdTx += paramSep + matrix + paramSep + muteState
				} else {
					cmdTx += paramSep + matrix + paramSep + options.mute
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${matrix}`)
					return undefined
				}
				const muteState = self.matrixMute[matrix]
				return {
					...action.options,
					mute: muteState,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.matrix.mute
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${MatrixCount}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + matrix)
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
				let cmdTx = cmd.matrix.polarity
				let matrix = await self.parseVariablesInString(options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${matrix}`)
					return false
				}
				let polState = (await self.matrixPolarity[matrix]) ^ 1
				if (options.query) {
					cmdTx += paramSep + matrix
				} else if (options.polarity == toggle) {
					cmdTx += paramSep + matrix + paramSep + polState
				} else {
					cmdTx += paramSep + matrix + paramSep + options.polarity
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${MatrixCount}`)
					return undefined
				}
				const polState = self.matrixPolarity[matrix]
				return {
					...action.options,
					polarity: polState,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.matrix.polarity
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${MatrixCount}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + matrix)
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
					id: 'useVar',
					type: 'checkbox',
					label: 'Use Variable',
					default: false,
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
					isVisible: (options) => {
						return options.useVar === false
					},
				},
				{
					id: 'gainVar',
					type: 'textinput',
					label: 'Gain - Variable',
					default: '',
					useVariables: true,
					regex: Regex.SOMETHING,
					isVisible: (options) => {
						return options.useVar === true
					},
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
				let cmdTx = cmd.matrix.gain
				let gainVar = Number(await self.parseVariablesInString(options.gainVar))
				gainVar = gainVar.toFixed(2)
				let gain = 0
				let matrix = await self.parseVariablesInString(options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${matrix}`)
					return false
				}
				if (options.useVar) {
					if (isNaN(gainVar)) {
						return undefined
					}
					gain = gainVar > 15 ? 15 : gainVar
					gain = gainVar < -25 ? -25 : gainVar
				} else {
					gain = options.gain
				}
				if (options.query) {
					cmdTx += paramSep + matrix
				} else {
					cmdTx += paramSep + matrix + paramSep + gain
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${MatrixCount}`)
					return undefined
				}
				const matrixGain = self.matrixGain[matrix]
				return {
					...action.options,
					gain: matrixGain,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.matrix.gain
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${MatrixCount}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + matrix)
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
				let cmdTx = cmd.matrix.gain
				let matrix = await self.parseVariablesInString(options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${matrix}`)
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
				cmdTx += paramSep + matrix + paramSep + gainRound
				self.addCmdtoQueue(cmdTx)
			},
			subscribe: async (action) => {
				let cmdTx = cmd.matrix.gain
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${MatrixCount}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + matrix)
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
					tooltip: 'Varible must return an integer output number 0 - 80',
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
				let cmdTx = cmd.matrix.output
				let matrix = await self.parseVariablesInString(options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${matrix}`)
					return false
				}
				let output = await self.parseVariablesInString(options.output)
				output = Math.floor(output)
				if (isNaN(output) || output < 0 || output > MaxChannelCount + 16) {
					self.log('warn', `an invalid varible has been passed: ${matrix}`)
					return false
				}
				if (options.query) {
					cmdTx += paramSep + matrix
				} else {
					cmdTx += paramSep + matrix + paramSep + output
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${matrix}`)
					return undefined
				}
				const matrixOutput = self.matrixOutput[matrix]
				return {
					...action.options,
					output: matrixOutput,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.matrix.output
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${matrix}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + matrix)
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
					id: 'useVar',
					type: 'checkbox',
					label: 'Use Variable',
					default: false,
				},
				{
					id: 'gain',
					type: 'number',
					label: 'Crosspoint Gain',
					default: -96,
					min: -96,
					max: 0,
					required: true,
					range: true,
					step: 0.5,
					regex: Regex.NUMBER,
					isVisible: (options) => {
						return options.useVar === false
					},
				},
				{
					id: 'gainVar',
					type: 'textinput',
					label: 'Gain - Variable',
					default: '',
					useVariables: true,
					regex: Regex.SOMETHING,
					isVisible: (options) => {
						return options.useVar === true
					},
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
				let cmdTx = cmd.matrix.crosspoint
				let gainVar = Number(await self.parseVariablesInString(options.gainVar))
				gainVar = gainVar.toFixed(2)
				let gain = 0
				let matrix = await self.parseVariablesInString(options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${matrix}`)
					return false
				}
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > MatrixSize) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return false
				}
				if (options.useVar) {
					if (isNaN(gainVar)) {
						return undefined
					}
					gain = gainVar > 0 ? 0 : gainVar
					gain = gainVar < -96 ? -96 : gainVar
				} else {
					gain = options.gain
				}
				if (options.query) {
					cmdTx += paramSep + matrix + paramSep + chan
				} else {
					cmdTx += paramSep + matrix + paramSep + chan + paramSep + gain
				}
				self.addCmdtoQueue(cmdTx)
			},
			learn: async (action) => {
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${MatrixCount}`)
					return undefined
				}
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > MatrixSize) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				const matrixXpoint = self.matrixXpoint[matrix][chan]
				return {
					...action.options,
					gain: matrixXpoint,
				}
			},
			subscribe: async (action) => {
				let cmdTx = cmd.matrix.crosspoint
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${MatrixCount}`)
					return undefined
				}
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > MatrixSize) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + matrix + paramSep + chan)
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
				let cmdTx = cmd.matrix.crosspoint
				let matrix = await self.parseVariablesInString(options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${matrix}`)
					return false
				}
				let chan = await self.parseVariablesInString(options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > MatrixSize) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
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
				cmdTx += paramSep + matrix + paramSep + chan + paramSep + gainRound
				self.addCmdtoQueue(cmdTx)
			},
			subscribe: async (action) => {
				let cmdTx = cmd.matrix.crosspoint
				let matrix = await self.parseVariablesInString(action.options.matrix)
				matrix = Math.floor(matrix)
				if (isNaN(matrix) || matrix < 1 || matrix > MatrixCount) {
					self.log('warn', `an invalid varible has been passed: ${MatrixCount}`)
					return undefined
				}
				let chan = await self.parseVariablesInString(action.options.channel)
				chan = Math.floor(chan)
				if (isNaN(chan) || chan < 1 || chan > MatrixSize) {
					self.log('warn', `an invalid varible has been passed: ${chan}`)
					return undefined
				}
				self.addCmdtoQueue(cmdTx + paramSep + matrix + paramSep + chan)
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
				self.addCmdtoQueue(cmd.scene.count)
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
				self.addCmdtoQueue(cmd.scene.active)
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
				let cmdTx = cmd.scene.recall
				let safeSceneName = await self.regexSafeString(await self.parseVariablesInString(options.name))
				if (safeSceneName != undefined && safeSceneName.length >= 1) {
					cmdTx += paramSep + safeSceneName
					self.addCmdtoQueue(cmdTx)
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
				let cmdTx = cmd.scene.save
				let safeSceneName = await self.regexSafeString(await self.parseVariablesInString(options.name))
				if (safeSceneName != undefined && safeSceneName.length >= 1) {
					cmdTx += paramSep + safeSceneName
					self.addCmdtoQueue(cmdTx)
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
				self.addCmdtoQueue(cmd.scene.saveNew)
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
				let cmdTx = cmd.scene.rename
				let safeSceneNameCurrent = await self.regexSafeString(await self.parseVariablesInString(options.currentname))
				let safeSceneNameNew = await self.regexSafeString(await self.parseVariablesInString(options.newname))

				if (
					safeSceneNameCurrent != undefined &&
					safeSceneNameCurrent.length >= 1 &&
					safeSceneNameNew != undefined &&
					safeSceneNameNew.length >= 1
				) {
					cmdTx += paramSep + safeSceneNameCurrent + paramSep + safeSceneNameNew
					self.addCmdtoQueue(cmdTx)
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
				let cmdTx = cmd.scene.delete
				let safeSceneName = await self.regexSafeString(await self.parseVariablesInString(options.name))
				if (safeSceneName != undefined && safeSceneName.length >= 1) {
					cmdTx += paramSep + safeSceneName
					self.addCmdtoQueue(cmdTx)
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
					choices: self.system_defaults,
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
					choices: self.system_subscribe,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: ({ options }) => {
				let cmdTx = cmd.system.subscribe
				if (!options.query) {
					cmdTx += paramSep + options.subscribe
				}
				self.addCmdtoQueue(cmdTx)
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.system.subscribe)
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
				let cmdTx = cmd.system.linkGroup
				if (!options.query) {
					cmdTx += paramSep + options.linkgroup
				}
				self.addCmdtoQueue(cmdTx)
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.system.linkGroup)
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
					default: 0,
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
				let cmdTx = cmd.system.clock
				if (!options.query) {
					cmdTx += paramSep + options.clock
				}
				self.addCmdtoQueue(cmdTx)
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.system.clock)
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
					choices: self.system_adatMirror,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: ({ options }) => {
				let cmdTx = cmd.system.adatMirror
				if (!options.query) {
					cmdTx += paramSep + options.mirror
				}
				self.addCmdtoQueue(cmdTx)
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.system.adatMirror)
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
				let cmdTx = cmd.system.automixChannels
				if (!options.query) {
					cmdTx += paramSep + options.channels
				}
				self.addCmdtoQueue(cmdTx)
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.system.automixChannels)
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
				let cmdTx = cmd.system.channelOffset
				if (!options.query) {
					cmdTx += paramSep + options.offset
				}
				self.addCmdtoQueue(cmdTx)
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.system.channelOffset)
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
					choices: self.system_blinkmode,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: ({ options }) => {
				let cmdTx = cmd.system.blinkMode
				if (!options.query) {
					cmdTx += paramSep + options.blink
				}
				self.addCmdtoQueue(cmdTx)
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.system.blinkMode)
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
					choices: self.system_dhcp,
				},
				{
					id: 'query',
					type: 'checkbox',
					label: 'Query',
					default: false,
				},
			],
			callback: ({ options }) => {
				let cmdTx = cmd.system.dhcp
				if (!options.query) {
					cmdTx += paramSep + options.dhcp
				}
				self.addCmdtoQueue(cmdTx)
			},
			subscribe: () => {
				self.addCmdtoQueue(cmd.system.dhcp)
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
					default: cmd.system.config,
					choices: self.system_query,
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
				let cmdTx = cmd.system.name
				if (!options.query) {
					let safeName = await self.regexSafeString(await self.parseVariablesInString(options.name))
					if (safeName != undefined && safeName.length >= 1) {
						cmdTx += paramSep + safeName
					} else {
						self.log('warn', 'Not a valid name')
						return false
					}
				}
				self.addCmdtoQueue(cmdTx)
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
					default: cmd.system.ip,
					choices: self.system_network,
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
				let cmdTx = options.mode
				if (!options.query) {
					let ip = options.IP.split('.')
					let cleanIP = []
					for (let i = 0; i < ip.length; i++) {
						cleanIP[i] = parseInt(ip[i])
						if (isNaN(cleanIP[i]) || cleanIP[i] < 0 || cleanIP[i] > 255) {
							self.log('warn', `Not a valid IP Address, byte: ${i + 1} Value: ${cleanIP[i]}`)
							return false
						}
					}
					if (cleanIP.length != 4) {
						self.log('warn', 'Not a valid IP Address, unexpected length')
						return false
					}
					cmdTx += paramSep + cleanIP[0] + paramSep + cleanIP[1] + paramSep + cleanIP[2] + paramSep + cleanIP[3]
				}
				self.addCmdtoQueue(cmdTx)
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
					default: cmd.metering.channelStatus,
					choices: self.query_meters,
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
					default: cmd.channel.bulkParams,
					choices: self.system_bulkconfig,
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
					default: cmd.channel.nameList,
					choices: self.query_namelistmode,
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
