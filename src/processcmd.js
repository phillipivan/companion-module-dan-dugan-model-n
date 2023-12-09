const {
	duganModels,
	paramSep,
	cmdSep,
	cmd,
	SOM,
	errSyntax1,
	errSyntax2,
	errRange,
	sampleRate,
	adatMirror,
	clockSources,
	MatrixCount,
	MatrixSize,
	GroupCount,
	grpAval,
	grpBval,
	grpCval,
	welcomeMessageM,
	welcomeMessageN,
	MaxChannelCount,
} = require('./consts.js')

module.exports = {
	async processBuffer(chunk) {
		let index = 0
		let varObject = []
		let buffer = new ArrayBuffer(chunk.length)
		let vals = new Uint8Array(buffer)
		let strRep = chunk.toString()
		while (strRep[0] != SOM && strRep.length > 0) {
			strRep = strRep.slice(1)
			index += 1
		}
		let cmdRx = await this.regexCmd(strRep)
		if ((strRep.length > 0) & !cmdRx) {
			return undefined
		} else if (strRep.length == 0) {
			return undefined
		}
		for (let i = index; i < chunk.length; i++) {
			vals[i - index] = chunk[i]
		}
		switch (cmdRx) {
			case SOM + cmd.channel.bulkParams:
				if (vals.length < 438) {
					// observed 454 but that may be with 'Dugan N >'
					this.log('warn', `*GP response detected. Expected length > 438 bytes. Buffer length: ${vals.length}`)
					return undefined
				}
				for (let i = 1; i <= MaxChannelCount; i++) {
					this.channelsMode[i] = vals[i + 3]
				}
				if (this.config.channels != vals[68]) {
					this.log(
						'warn',
						`Mismatch between configured channels: ${this.config.channels} and connected device: ${vals[68]}. Changing configuration.`
					)
					this.config.channels = vals[68]
					this.initVariables()
					this.updateActions() // export actions
					this.updateFeedbacks() // export feedbacks
				}
				for (let i = 1; i <= 8; i++) {
					let bypassFlags = this.processBitFlags(i + 68)
					let nomFlags = this.processBitFlags(i + 76)
					let musicFlags = this.processBitFlags(i + 84)
					let overrideFlags = this.processBitFlags(i + 92)
					if (bypassFlags == false || nomFlags == false || musicFlags == false || overrideFlags == false) {
						this.log('warn', '*GP, Unexpected response - one of the bitflag fields returned false')
						return false
					}
					for (let y = 0; y < bypassFlags.length; y++) {
						let channel = y + 1 + (i - 1) * 8
						this.channelsBypass[channel] = bypassFlags[y]
						this.channelsNom[channel] = nomFlags[y]
						this.channelsMusic[channel] = musicFlags[y]
						this.channelsOverride[channel] = overrideFlags[y]
					}
				}
				for (let i = 1; i <= 16; i++) {
					let groupAssignFlags = this.process2BitFlags(i + 100)
					let presetFlags = this.process2BitFlags(i + 116)
					if (groupAssignFlags == false || presetFlags == false) {
						this.log('warn', 'Unexpected response')
						return false
					}
					for (let y = 0; y < presetFlags.length; y++) {
						let channel = y + 1 + (i - 1) * 4
						this.channelsPreset[channel] = presetFlags[y]
						this.channelsGroupAssign[channel] = groupAssignFlags[y]
						this.channelsPreset[channel] = presetFlags[y]
					}
				}
				this.checkFeedbacks(
					'channelMode',
					'channelPreset',
					'channelBypass',
					'channelOverride',
					'channelMusic',
					'channelNOM',
					'channelGroupAssign'
				)
				break
			case SOM + cmd.matrix.bulkParams:
				//get matrix params
				//binary response
				if (vals.length < 884) {
					this.log('warn', `*GM response detected. Expected length >= 884 bytes. Buffer length: ${vals.length}`)
					return undefined
				}
				for (let i = 1; i <= MatrixCount; i++) {
					this.matrixGain[i] = this.calcXpointGain(vals[i + 879])
					varObject[`matrixOutFader ${vals[1]}`] = this.matrixGain[i]
					for (let x = 1; x <= MatrixSize; x++) {
						this.matrixXpoint[i][x] = this.calcXpointGain(vals[x + 3 + (i - 1) * MatrixSize])
						varObject[`matrix${i}Xpoint${x}`] = this.matrixXpoint[i][x]
					}
					this.setVariableValues(varObject)
				}
				break
			// unknown data in indexes 868 - 891, 892 - 901
			// perhaps 886 - 891 are matrix output patch
			case SOM + cmd.metering.channelStatus:
				//channel status
				//binary response
				if (vals.length < 235) {
					this.log('debug', `*GS response detected. Expected length >= 235 bytes. Buffer length: ${vals.length}`)
					return undefined
				}
				//this.log('debug', '*GS found. Length: ' + vals.length)
				for (let i = 1; i <= 8; i++) {
					let signalFlags = this.processBitFlags(parseInt(vals[i + 3], 10))
					let clipFlags = this.processBitFlags(parseInt(vals[i + 11], 10))
					if (signalFlags == false || clipFlags == false) {
						this.log(
							'warn',
							'Unexpected response signal flags: ' +
								parseInt(vals[i + 3], 10) +
								' clip flags: ' +
								parseInt(vals[i + 11], 10)
						)
						return undefined
					}
					for (let y = 0; y < signalFlags.length; y++) {
						let channel = y + 1 + (i - 1) * 8
						this.channelsPresence[channel] = signalFlags[y]
						this.channelsClip[channel] = clipFlags[y]
					}
				}
				// reclip = index 20
				for (let i = 1; i <= MaxChannelCount; i++) {
					this.channelsAmixGain[i] = this.calcGain(Number(vals[i + 20]))
					this.channelsInputPeak[i] = this.calcGain(Number(vals[i + 90]))
					this.channelsOutputPeak[i] = this.calcGain(Number(vals[i + 154]))
					varObject[`channelAmixGain${i}`] = this.channelsAmixGain[i]
					varObject[`channelInputLevel${i}`] = this.channelsInputPeak[i]
					varObject[`channelOutputLevel${i}`] = this.channelsOutputPeak[i]
				}
				for (let i = 1; i <= GroupCount; i++) {
					this.groupNOMpeak[i] = this.calcGain(Number(vals[i + 84]))
					this.groupMusicPeak[i] = this.calcGain(Number(vals[i + 220]))
					varObject[`groupNOMpeak${i}`] = this.groupNOMpeak[i]
					varObject[`groupMSTgain${i}`] = this.groupMusicPeak[i]
				}
				for (let i = 1; i <= MatrixCount; i++) {
					this.matrixOutputPeak[i] = this.calcGain(Number(vals[i + 226]))
					varObject[`matrixOutLevel${i}`] = this.matrixOutputPeak[i]
				}
				this.setVariableValues(varObject)
				this.checkFeedbacks(
					'channelPresence',
					'channelClip',
					'channelAmixGain',
					'channelInputPeak',
					'channelOutputPeak',
					'matrixLevel',
					'groupNOMgain',
					'groupMusicPeak'
				)
				this.checkIsTalking()
				break
			default:
				await this.processCmds(strRep)
		}
	},

	async processCmds(cmdRx) {
		let string = cmdRx.toString()
		let lines = string.split('\r\n')
		await lines.forEach(async (line) => {
			let cmds = line.split(cmdSep)
			await cmds.forEach((element) => {
				if (element.length > 3) {
					this.processParams(element)
				}
			})
		})
		return true
	},

	async processParams(cmdRx) {
		let str = cmdRx.toString()
		let varObject = {}
		while (str[0] != SOM && str.length > 0) {
			str = str.slice(1)
		}
		let params = str.split(paramSep)
		if (params[1] == errSyntax1 || params[1] == errSyntax2 || params[1] == errRange) {
			this.log('warn', `bad response: ${str}`)
			return undefined
		}
		switch (params[0]) {
			case SOM + cmd.channel.mode:
				//channel mode
				//this.log('debug', `CM response found: ${str}`)
				if (params.length == 3) {
					this.channelsMode[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('channelMode')
				} else {
					this.log('warn', `Unexpected CM response: ${str}`)
				}
				break
			case SOM + cmd.channel.preset:
				//channel preset
				//this.log('debug', `CP response found: ${str}`)
				if (params.length == 3) {
					this.channelsPreset[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('channelPreset')
				} else {
					this.log('warn', `Unexpected CP response: ${str}`)
				}
				break
			case SOM + cmd.channel.bypass:
				//channel bypass
				//this.log('debug', `BP response found: ${str}`)
				if (params.length == 3) {
					this.channelsBypass[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('channelBypass')
				} else {
					this.log('warn', `Unexpected BP response: ${str}`)
				}
				break
			case SOM + cmd.channel.override:
				//channel override
				//this.log('debug', `CO response found: ${str}`)
				if (params.length == 3) {
					this.channelsOverride[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('channelOverride')
				} else {
					this.log('warn', `Unexpected CO response: ${str}`)
				}
				break
			case SOM + cmd.channel.weight:
				//channel weight
				//this.log('debug', `CW response found: ${str}`)
				if (params.length == 3) {
					this.channelsWeight[Number(params[1])] = Number(params[2])
					//then push to variable
					varObject['channelWeight' + params[1]] = Number(params[2])
					this.setVariableValues(varObject)
				} else {
					this.log('warn', `Unexpected CW response: ${str}`)
				}
				break
			case SOM + cmd.channel.music:
				//music mode
				//this.log('debug', `MR response found: ${str}`)
				if (params.length == 3) {
					this.channelsMusic[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('channelMusic')
				} else {
					this.log('warn', `Unexpected MR response: ${str}`)
				}
				break
			case SOM + cmd.channel.nom:
				//NOM mode
				//this.log('debug', `NE response found: ${str}`)
				if (params.length == 3) {
					this.channelsNom[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('channelNOM')
				} else {
					this.log('warn', `Unexpected NE response: ${str}`)
				}
				break
			case SOM + cmd.channel.group:
				//group assign
				//this.log('debug', `GA response found: ${str}`)
				if (params.length == 3) {
					this.log('info', `Channel: ${params[1]} assigned to group: ${params[2]}`)
					this.channelsGroupAssign[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('channelGroupAssign')
				} else {
					this.log('warn', `Unexpected GA response: ${str}`)
				}
				break
			case SOM + cmd.channel.name:
				//channel name
				//this.log('debug', `CN response found: ${str}`)
				if (params.length == 3) {
					this.channelsName[Number(params[1])] = params[2]
					varObject[`channelName${params[1]}`] = params[2]
					this.setVariableValues(varObject)
				} else {
					this.log('warn', `Unexpected CN response: ${str}`)
				}
				break
			case SOM + cmd.group.mute:
				//group mute
				//this.log('debug', `SM response found: ${str}`)
				if (params.length == 2) {
					this.groupMute[1] = Number(params[1]) & grpAval
					this.groupMute[2] = Number(params[1]) & grpBval
					this.groupMute[3] = Number(params[1]) & grpCval
					this.checkFeedbacks('groupMute')
				} else {
					this.log('warn', `Unexpected SM response: ${str}`)
				}
				break
			case SOM + cmd.group.preset:
				//group preset
				//this.log('debug', `SP response found: ${str}`)
				if (params.length == 2) {
					this.groupPreset[1] = Number(params[1]) & grpAval
					this.groupPreset[2] = Number(params[1]) & grpBval
					this.groupPreset[3] = Number(params[1]) & grpCval
					this.checkFeedbacks('groupPreset')
				} else {
					this.log('warn', `Unexpected SP response: ${str}`)
				}
				break
			case SOM + cmd.group.override:
				//group override
				//this.log('debug', `SO response found: ${str}`)
				if (params.length == 2) {
					this.groupOverride[1] = Number(params[1]) & grpAval
					this.groupOverride[2] = Number(params[1]) & grpBval
					this.groupOverride[3] = Number(params[1]) & grpCval
					this.checkFeedbacks('groupOverride')
				} else {
					this.log('warn', `Unexpected SO response: ${str}`)
				}
				break
			case SOM + cmd.group.lastHold:
				//last hold
				//this.log('debug', `LH response found: ${str}`)
				if (params.length == 2) {
					this.groupLastHold[1] = Number(params[1]) & grpAval
					this.groupLastHold[2] = Number(params[1]) & grpBval
					this.groupLastHold[3] = Number(params[1]) & grpCval
				} else {
					this.log('warn', `Unexpected LH response: ${str}`)
				}
				break
			case SOM + cmd.group.automixDepth: //same as ME
			case SOM + cmd.group.automixDepthAlt:
				//automix depth
				//this.log('debug', `AD or ME response found: ${str}`)
				if (params.length == 3) {
					this.groupAutomixDepth[Number(params[1])] = Number(params[2])
					varObject['groupAD' + params[1]] = Number(params[2])
					this.setVariableValues(varObject)
				} else {
					this.log('warn', `Unexpected AD/ME response: ${str}`)
				}
				break
			case SOM + cmd.group.nomGainLimit:
				//nom gain limit
				//this.log('debug', `NL response found: ${str}`)
				if (params.length == 3) {
					this.groupNOMgainlimit[Number(params[1])] = Number(params[2])
					varObject[`groupNOM${params[1]}`] = Number(params[2])
					this.setVariableValues(varObject)
				} else {
					this.log('warn', `Unexpected NL response: ${str}`)
				}
				break
			case SOM + cmd.group.musicThreshold:
				//music system threshold
				//this.log('debug', `MT response found: ${str}`)
				if (params.length == 3) {
					this.groupMusicThreshold[Number(params[1])] = Number(params[2])
					varObject[`groupMST${params[1]}`] = Number(params[2])
					this.setVariableValues(varObject)
				} else {
					this.log('warn', `Unexpected MT response: ${str}`)
				}
				break
			case SOM + cmd.group.musicInput:
				//music system threshold input
				//this.log('debug', `MC response found: ${str}`)
				if (params.length == 3) {
					this.groupMusicInput[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('groupMusicInput')
				} else {
					this.log('warn', `Unexpected MXM response: ${str}`)
				}
				break
			case SOM + cmd.matrix.mute:
				//matrix bus mute
				//this.log('debug', `MXM response found: ${str}`)
				if (params.length == 3) {
					this.matrixMute[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('matrixMuted')
				} else {
					this.log('warn', `Unexpected MXM response: ${str}`)
				}
				break
			case SOM + cmd.matrix.polarity:
				//matrix bus polarity
				//this.log('debug', `MXP response found: ${str}`)
				if (params.length == 3) {
					this.matrixPolarity[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('matrixPolarity')
				} else {
					this.log('warn', `Unexpected MXP response: ${str}`)
				}
				break
			case SOM + cmd.matrix.gain:
				//matrix bus gain
				//this.log('debug', `MXV response found: ${str}`)
				if (params.length == 3) {
					this.matrixGain[Number(params[1])] = Number(params[2])
					varObject[`matrixOutFader${params[1]}`] = Number(params[2])
					this.setVariableValues(varObject)
				} else {
					this.log('warn', `Unexpected MXV response: ${str}`)
				}
				break
			case SOM + cmd.matrix.output:
				//matrix bus ouput
				//this.log('info', `Matrix ${params[1]} output patch changed to ${params[2]}`)
				if (params.length == 3) {
					this.matrixOutput[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('matrixOutput')
				} else {
					this.log('warn', `Unexpected MXM response: ${str}`)
				}
				break
			case SOM + cmd.matrix.crosspoint:
				//matrix crosspoint
				//this.log('debug', `OM response found: ${str}`)
				if (params.length == 4) {
					this.matrixXpoint[Number(params[1])][Number(params[2])] = Number(params[3])
					varObject[`matrix${params[1]}Xpoint${params[2]}`] = Number(params[3])
					this.setVariableValues(varObject)
				} else {
					this.log('warn', `Unexpected OM response: ${str}`)
				}
				break
			case SOM + cmd.scene.count:
				//scene count
				//this.log('debug', `SNC response found: ${str}`)
				if (params.length == 2) {
					if (isNaN(Number(params[1]))) {
						this.log('warn', `Unexpected SNC response: ${str}`)
						return false
					}
					this.setVariableValues({
						sceneCount: Number(params[1]),
					})
					this.addCmdtoQueue(`${cmd.scene.nameList},1,${Number(params[1])}`)
				} else {
					this.log('warn', 'Unexpected SNC response: ' + str)
				}
				break
			case SOM + cmd.scene.active:
				//active scene
				//this.log('debug', `SNA response found: ${str}`)
				if (params.length == 4) {
					let hasChanged = Number(params[3]) == 1 ? true : false
					this.setVariableValues({
						sceneActive: params[1].toString(),
						sceneActiveIndex: Number(params[2]),
						sceneActiveChanged: hasChanged,
					})
					this.sceneChanged = hasChanged
					this.checkFeedbacks('sceneChanged')
				} else {
					this.log('warn', `Unexpected SNA response: ${str}`)
				}
				break
			case SOM + cmd.scene.recall:
				//recall scene
				//this.log('debug', `SNR response found: ${str}`)
				if (params.length == 2) {
					let err = params[1].search('Error: scene')
					if (err == -1) {
						this.log('info', `Scene Recalled: ${params[1]}`)
						this.addCmdtoQueue(cmd.scene.active)
					} else {
						this.log('warn', str)
					}
				} else {
					this.log('warn', `Unexpected SNR response: ${str}`)
				}
				break
			case SOM + cmd.scene.save:
			case SOM + cmd.scene.saveNew:
				//save scene & save new scene
				//this.log('debug', `SNS or SNN response found: ${str}`)
				if (params.length == 2) {
					let err = params[1].search('Error: scene')
					if (err == -1) {
						this.log('info', `New scene saved: ${params[1]}`)
						this.addCmdtoQueue(cmd.scene.count)
						this.addCmdtoQueue(cmd.scene.active)
					} else {
						this.log('warn', str)
					}
				} else {
					this.log('warn', `Unexpected SNN/SNS response: ${str}`)
				}
				break
			case SOM + cmd.scene.rename:
				//rename scene
				//this.log('debug', `SNE response found: ${str}`)
				if (params.length == 3) {
					this.log('info', `Scene: ${params[1]}. Renamed to: ${params[2]}`)
					this.addCmdtoQueue(cmd.scene.count)
					this.addCmdtoQueue(cmd.scene.active)
				} else {
					this.log('warn', `Error response:  ${str}`)
				}
				break
			case SOM + cmd.scene.delete:
				//delete scene
				//this.log('debug', `SND response found: ${str}`)
				if (params.length == 2) {
					let err = params[1].search('Error: scene')
					if (err == -1) {
						this.log('info', `Scene Deleted: ${params[1]}`)
						this.addCmdtoQueue(cmd.scene.count)
						this.addCmdtoQueue(cmd.scene.active)
					} else {
						this.log('warn', params[1])
					}
				} else {
					this.log('warn', `Unexpected SND response: ${str}`)
				}
				break
			case SOM + cmd.scene.defaults:
				//channel defaults
				this.log('info', `Channels reset to defaults. ${str}`)
				this.addCmdtoQueue(cmd.scene.active)
				break
			case SOM + cmd.matrix.defaults:
				//matrix defauls
				this.log('info', `Matrix reset to defaults. ${str}`)
				break
			case SOM + cmd.system.subscribe:
				//subscribe unsolicited
				//this.log('debug', `SU response found: ${str}`)
				if (isNaN(params[1])) {
					this.log('warn', `SU has returned an unexpected value: ${str}`)
					return false
				}
				this.config.subscription = params[1]
				this.log('info', `Subscribe unsolicited level set. Level: ${params[1]}`)
				break
			case SOM + cmd.system.linkGroup:
				//link group
				//this.log('debug', `LG response found: ${str}`)
				if (params.length == 2) {
					this.setVariableValues({
						linkGroup: Number(params[1]),
					})
				} else {
					this.log('warn', `Unexpected LG response: ${str}`)
				}
				break
			case SOM + cmd.system.clock:
				//clock sourse
				//this.log('debug', `CS response found: ${str}`)
				if (params.length == 2) {
					if (params[1] > 0) {
						this.setVariableValues({
							clockSource: clockSources[params[1]],
						})
					} else if (params[1] == 0 && this.config.model == 11) {
						this.setVariableValues({
							clockSource: 'Madi',
						})
					} else if (params[1] == 0 && this.config.model == 12) {
						this.setVariableValues({
							clockSource: 'Dante',
						})
					} else {
						this.setVariableValues({
							clockSource: 'Unknown',
						})
					}
				} else {
					this.log('warn', `Unexpected CS response: ${str}`)
				}
				break
			case SOM + cmd.system.adatMirror:
				//adat mirror
				//this.log('debug', `AM response found:  ${str}`)
				if (params.length == 2) {
					this.setVariableValues({
						adatMirror: adatMirror[params[1]],
					})
				} else {
					this.log('warn', `Unexpected AM response: ${str}`)
				}
				break
			case SOM + cmd.system.automixChannels:
				//automix channels
				//this.log('debug', 'CFN response found: ' + str)
				if (params.length == 2) {
					this.setVariableValues({
						channelCount: Number(params[1]),
					})
					if (Number(params[1]) != this.config.channels) {
						this.log(
							'warn',
							`Mismatch between configured channels: ${this.config.channels} and connected device: ${Number(
								params[1]
							)}. Changing configuration.`
						)
						this.config.channels = Number(params[1])
						this.initVariables()
						this.updateActions() // export actions
						this.updateFeedbacks() // export feedbacks
						//this.updateVariableDefinitions() // export variable definitions
						//this.setVariableValues(variableDefaults)
					}
				} else {
					this.log('warn', `Unexpected CFN response: ${str}`)
				}
				break
			case SOM + cmd.system.channelOffset:
				//input channel offset
				//this.log('debug', `CFS response found: ${str}`)
				if (params.length == 2) {
					this.setVariableValues({
						inputOffset: Number(params[1]),
					})
				} else {
					this.log('warn', `Unexpected CFS response: ${str}`)
				}
				break
			case SOM + cmd.system.blinkMode:
				//blink mode
				//this.log('debug', `BM response found: ${str}`)
				if (params.length == 2) {
					let blink = params[1] == '1' ? true : false
					this.setVariableValues({
						blinkMode: blink,
					})
				} else {
					this.log('warn', `Unexpected BM response: ${str}`)
				}
				break
			case SOM + cmd.system.dhcp:
				//dhcp
				//this.log('debug', `DH response found: ${str}`)
				if (params.length == 2) {
					let dhcp = params[1] == '1' ? true : false
					this.setVariableValues({
						master: dhcp,
					})
				} else {
					this.log('warn', `Unexpected DH response: ${str}`)
				}
				break
			case SOM + cmd.system.config:
				//system config
				//this.log('debug', `SC response found: ${str}`)
				if (params.length == 13) {
					let dhcp = params[11] == '1' ? true : false
					this.setVariableValues({
						deviceType: duganModels[params[1]],
						hostName: params[2],
						serialNumber: params[3],
						firmwareVersion: params[4],
						fpgaVersion: params[5],
						hardwareRevsion: params[6],
						macAddress: params[7],
						ipAddress: params[8],
						netMask: params[9],
						gateway: params[10],
						dhcp: dhcp,
						channelCount: Number(params[12]),
					})
					//checks for expected model and channel count
					if (params[1] != this.config.model) {
						this.log(
							'warn',
							`Mismatch between configured model: ${duganModels[this.config.model]} and connected device: ${
								duganModels[params[1]]
							}`
						)
						this.config.model = Number(params[1])
					}
					if (Number(params[12]) != this.config.channels) {
						this.log(
							'warn',
							`Mismatch between configured channels: ${this.config.channels} and connected device: ${Number(
								params[12]
							)}. Changing configuration.`
						)
						this.config.channels = Number(params[12])
						this.initVariables()
						this.updateActions() // export actions
						this.updateFeedbacks() // export feedbacks
						this.updateVariableDefinitions() // export variable definitions
						//this.setVariableValues(variableDefaults)
					}
				} else {
					this.log('warn', `Unexpected SC response: ${str}`)
				}
				break
			case '*VE':
				//firmware versions
				//this.log('debug', `VE response found: ${str}`)
				if (params.length == 5) {
					this.setVariableValues({
						firmwareVersion: params[1],
						firmwareSecVersion: params[2],
						fpgaVersion: params[3],
						hardwareRevsion: params[4],
					})
				} else {
					this.log('warn', `Unexpected VE response: ${str}`)
				}
				break
			case SOM + cmd.system.connections:
				//client connections
				//this.log('debug', `CC response found: ${str}`)
				if (params.length == 3) {
					let udp = params[1].split(':')
					let tcp = params[2].split(':')
					this.setVariableValues({
						clientUDP: Number(udp[1]),
						clientTCP: Number(tcp[1]),
					})
					if (Number(udp[1]) + Number(tcp[1]) == 5) {
						this.log('warn', 'All connections full, cannot accept more concurrent clients')
					}
				} else {
					this.log('warn', `Unexpected CC response: ${str}`)
				}
				break
			case SOM + cmd.system.resourceUseage:
				//resource useage
				//this.log('debug', `HW response found: ${str}`)
				if (params.length == 9) {
					let heatBeat = params[1].split(':')
					let lwip = params[2].split(':')
					let dsp = params[3].split(':')
					let tcpip = params[4].split(':')
					let macrx = params[5].split(':')
					let mactx = params[6].split(':')
					let rtos = params[7].split(':')
					let malloc = params[8].split(':')
					this.setVariableValues({
						heartBeat: Number(heatBeat[1]),
						lwip: Number(lwip[1]),
						dsp: Number(dsp[1]),
						tcpip: Number(tcpip[1]),
						macRX: Number(macrx[1]),
						macTX: Number(mactx[1]),
						rtosHeapFree: Number(rtos[1]),
						mallocHeadFree: Number(malloc[1]),
					})
				} else {
					this.log('warn', `Unexpected HW response: ${str}`)
				}
				break
			case SOM + cmd.system.switchHeadroom:
				//switch headroom
				//this.log('debug', `HR response found: ${str}`)
				this.setVariableValues({
					switchHeadroom: Number(params[1]),
				})
				break
			case SOM + cmd.system.sampleRate:
				//sample rate
				if (params.length == 2) {
					if (params[1] == '0' || params[1] == '1') {
						this.setVariableValues({
							sampleRate: sampleRate[params[1]],
						})
					} else {
						this.setVariableValues({
							sampleRate: params[1],
						}) //this shouldnt happen
					}
				} else {
					this.log('warn', `Unexpected SF response: ${str}`)
				}
				break
			case SOM + cmd.system.master:
				//master mode
				//this.log('debug', `MM response found: ${str}`)
				if (params.length == 2) {
					let mstSlv = Number(params[2]) == 1 ? true : false
					this.setVariableValues({
						master: mstSlv,
					})
				} else {
					this.log('warn', `Unexpected MM response: ${str}`)
				}
				break
			case SOM + cmd.system.name:
				//system name
				//this.log('debug', `NA response found: ${str}`)
				if (params.length == 2) {
					this.setVariableValues({
						hostName: params[1],
					})
				} else {
					this.log('warn', `Unexpected NA response: ${str}`)
				}
				break
			case SOM + cmd.system.ip:
				//ip
				//this.log('debug', `IP response found: ${str}`)
				if (params.length == 5) {
					this.setVariableValues({
						ipAddress: params[2] + '.' + params[3] + '.' + params[4] + '.' + params[5],
					})
				} else {
					this.log('warn', `Unexpected IP response: ${str}`)
				}
				break
			case SOM + cmd.system.netmask:
				//netmask
				//this.log('debug', `NM response found: ${str}`)
				if (params.length == 5) {
					this.setVariableValues({
						netMask: params[2] + '.' + params[3] + '.' + params[4] + '.' + params[5],
					})
				} else {
					this.log('warn', `Unexpected NM response: ${str}`)
				}
				break
			case SOM + cmd.system.gateway:
				//gateway
				//this.log('debug', `GW response found: ${str}`)
				if (params.length == 5) {
					this.setVariableValues({
						gateway: `${params[2]}.${params[3]}.${params[4]}.${params[5]}`,
					})
				} else {
					this.log('warn', `Unexpected GW response: ${str}`)
				}
				break
			case SOM + cmd.channel.nameList:
				//channel name list
				//this.log('debug', `CNS response found: ${str}`)
				if (params.length >= 4) {
					if (params.length == 3 + Number(params[2])) {
						let startCh = Number(params[1])
						let count = Number(params[2])
						for (let i = startCh; i <= startCh + count - 1; i++) {
							varObject[`channelName${i}`] = params[i - startCh + 3]
							this.channelsName[i] = params[i - startCh + 3]
						}
						this.setVariableValues(varObject)
					} else {
						this.log('warn', `Unexpected length. Expected: ${3 + Number(params[2])} Recieved: ${params.length}`)
					}
				} else {
					this.log('warn', `Unexpected CNS length: ${str}`)
				}
				break
			case SOM + cmd.scene.nameList:
				//scene name list
				//this.log('debug', `SNL response found: ${str}`)
				if (params.length > 4) {
					this.sceneList = []
					for (let i = 4; i < params.length; i++) {
						this.sceneList.push({ id: params[i], label: params[i].toString() })
					}
					this.updateActions()
				} else if (params.length == 4) {
					this.log('warn', `No custom scenes saved. ${str}`)
					this.sceneList = []
					this.updateActions()
				} else {
					this.log('warn', `Unexpected SNL response: ${str}`)
				}
				break
			case SOM + cmd.metering.automixGain:
				//automix gains for all
				//this.log('debug', `GSA response found: ${str}`)
				if (params.length != MaxChannelCount + 1) {
					this.log('warn', `Unexpected GSA length: ${params.length} response: ${str}`)
					return false
				} else {
					for (let i = 1; i <= this.config.channels; i++) {
						this.channelsAmixGain[i] = this.calcGain(Number(params[i]))
						this.checkFeedbacks('channelAmixGain')
						varObject[`channelAmixGain${i}`] = this.channelsAmixGain[i]
					}
					this.setVariableValues(varObject)
					this.checkFeedbacks('channelAmixGain')
					this.checkIsTalking()
				}
				break
			case SOM + cmd.metering.signalClip:
				//signal clip DUGAN N returns responses as *GSS!!!
				//this.log('debug', `GSC response found: ${str}`)
				if (params.length != 9) {
					this.log('warn', `Unexpected GSC length: ${str}`)
					return false
				} else {
					for (let i = 1; i < params.length; i++) {
						let flags = this.processBitFlags(parseInt(params[i], 16))
						if (flags == false) {
							this.log('warn', `Unexpected response: ${flags}`)
							return false
						}
						for (let y = 0; y < flags.length; y++) {
							let channel = y + 1 + (i - 1) * 8
							this.channelsClip[channel] = flags[y]
							//this.log('debug', 'Channel ' + channel + ' Clip flag is ' + flags[y])
						}
					}
					this.checkFeedbacks('channelClip')
				}
				break
			case SOM + cmd.metering.signalPresense:
			case SOM + cmd.metering.signalPresenseAlt:
				//signal presence GSS Model E2A, E3A, GSP for Model M & N
				//this.log('debug', `GSS or GSP response found: ${str}`)
				if (params.length != 9) {
					this.log('warn', `Unexpected GSS/GSP length: ${str}`)
					return false
				} else {
					for (let i = 1; i < params.length; i++) {
						let flags = this.processBitFlags(parseInt(params[i], 16))
						if (flags == false) {
							this.log('warn', `Unexpected response: ${flags}`)
							return false
						}
						for (let y = 0; y < flags.length; y++) {
							let channel = y + 1 + (i - 1) * 8
							this.channelsPresence[channel] = flags[y]
						}
					}
					this.checkFeedbacks('channelPresence')
				}
				break
			case SOM + cmd.metering.inputPeaks:
				//input peaks
				//this.log('debug', `GSI response found: ${str}`)
				if (params.length != MaxChannelCount + 1) {
					this.log('warn', `Unexpected GSI length: ${params.length} response: ${str}`)
					return false
				} else {
					for (let i = 1; i <= this.config.channels; i++) {
						this.channelsInputPeak[i] = this.calcGain(Number(params[i]))
						this.checkFeedbacks('channelInputPeak')
						varObject[`channelInputLevel${i}`] = this.channelsInputPeak[i]
					}
					this.setVariableValues(varObject)
					this.checkFeedbacks('channelInputPeak')
				}
				break
			case SOM + cmd.metering.outputPeaks:
				//output peaks
				//this.log('debug', `GSO response found: ${str}`)
				if (params.length != MaxChannelCount + 1) {
					this.log('warn', `Unexpected GSO length: ${params.length} response: ${str}`)
					return false
				} else {
					for (let i = 1; i <= this.config.channels; i++) {
						this.channelsOutputPeak[i] = this.calcGain(Number(params[i]))
						this.checkFeedbacks('channelOutputPeak')
						varObject[`channelOutputLevel${i}`] = this.channelsOutputPeak[i]
					}
					this.setVariableValues(varObject)
					this.checkFeedbacks('channelOutputPeak')
				}
				break
			case SOM + cmd.metering.musicRef:
				//music reference peaks
				//this.log('debug', `GSM response found: ${str}`)
				if (params.length != GroupCount + 1) {
					this.log('warn', `Unexpected GSM length: ${params.length} response: ${str}`)
					return false
				} else {
					for (let i = 1; i <= GroupCount; i++) {
						this.groupMusicPeak[i] = this.calcGain(Number(params[i]))
						this.checkFeedbacks('groupMusicPeak')
						varObject[`groupMSTgain${i}`] = this.groupMusicPeak[i]
					}
					this.setVariableValues(varObject)
					this.checkFeedbacks('groupMusicPeak')
				}
				break
			case SOM + cmd.metering.nomGain:
				//nom gain limits
				//this.log('debug', `GSN response found: ${str}`)
				if (params.length != GroupCount + 1) {
					this.log('warn', `Unexpected GSN length: ${params.length} response: ${str}`)
					return false
				} else {
					for (let i = 1; i <= GroupCount; i++) {
						this.groupNOMpeak[i] = this.calcGain(Number(params[i]))
						this.checkFeedbacks('groupNOMgain')
						varObject[`groupNOMpeak${i}`] = this.groupNOMpeak[i]
					}
					this.setVariableValues(varObject)
					this.checkFeedbacks('groupNOMgain')
				}
				break
			case SOM + cmd.metering.matrixOutput:
				//matrix output meters
				//this.log('debug', `GSX response found: ${str}`)
				if (params.length != MatrixCount + 1) {
					this.log('warn', `Unexpected GSX length: ${params.length} response: ${str}`)
					return false
				} else {
					for (let i = 1; i <= MatrixCount; i++) {
						this.matrixOutputPeak[i] = this.calcGain(Number(params[i]))
						this.checkFeedbacks('matrixLevel')
						varObject[`matrixOutLevel${i}`] = this.matrixOutputPeak[i]
					}
					this.setVariableValues(varObject)
					this.checkFeedbacks('matrixLevel')
				}
				break
			case SOM + cmd.system.ping:
				this.log('info', `Ping received: ${params[1]}`)
				break
			case SOM + cmd.system.pd:
				//The meaning of this is not documented.
				this.log('info', `PD received: ${params[1]}`)
				break
			case 'Dugan N >':
			case 'Dugan M >':
			case '':
				break
			case welcomeMessageM:
			case welcomeMessageN:
				this.log('info', cmdRx)
				break
			default:
				this.log('warn', `Unexpected response from unit: ${cmdRx}`)
		}
	},
}
