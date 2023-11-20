const {
	duganModels,
	paramSep,
	cmdSep,
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
	welcomeMessage,
	MaxChannelCount,
} = require('./consts.js')
const { processBitFlags } = require('./util.js')

module.exports = {
	async processBuffer(chunk) {
		this.log('debug', 'processBuffer: ' + chunk)
		let strRep = chunk.toString()
		let cmd = await this.regexCmd(strRep)
		let buffer = new ArrayBuffer(chunk.length)
		let vals = new Uint8Array(buffer)
		//let weights = new Float32Array(buffer, 140, 64)
		let varObject = []
		for (let i = 0; i < chunk.length; i++) {
			vals[i] = chunk[i]
		}
		switch (cmd) {
			case '*GP,':
				//get channelparams
				//binary response
				this.log(
					'debug',
					'*GP response detected. Buffer Uint8 length: ' + vals.length + ' float32 length: ' //+ weights.length
				)
				//for (let i = 0; i < vals.length; i++) {
				//	this.log('debug', 'Index: ' + i + ' value: ' + vals[i])
				//}
				//for (let i = 0; i < weights.length; i++) {
				//	this.log('debug', 'Index: ' + i + 'Weight value: ' + weights[i])
				//}
				if (vals.length != 454) {
					this.log('warn', '*GP response detected. Expected length 454 bytes. Buffer length: ' + vals.length)
				}
				for (let i = 1; i <= MaxChannelCount; i++) {
					this.channelsMode[i] = vals[i + 3]
				}
				if (this.config.channels != vals[68]) {
					this.log(
						'warn',
						'Mismatch between configured channels: ' +
							this.config.channels +
							' and connected device: ' +
							vals[68] +
							'. Changing configuration.'
					)
					this.config.channels = vals[68]
					this.initVariables()
					this.updateActions() // export actions
					this.updateFeedbacks() // export feedbacks
					//this.updateVariableDefinitions() // export variable definitions
					//this.setVariableValues(variableDefaults)
				}
				for (let i = 1; i <= 8; i++) {
					let bypassFlags = this.processBitFlags(i + 68)
					let nomFlags = this.processBitFlags(i + 76)
					let musicFlags = this.processBitFlags(i + 84)
					let overrideFlags = this.processBitFlags(i + 92)
					if (bypassFlags == false || nomFlags == false || musicFlags == false || overrideFlags == false) {
						this.log('warn', 'Unexpected response')
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
			case '*GM,':
				//get matrix params
				//binary response
				if (vals.length != 902) {
					this.log('warn', '*GM response detected. Expected length 902 bytes. Buffer length: ' + vals.length)
				}
				for (let i = 1; i <= MatrixCount; i++) {
					this.matrixGain[i] = this.calcXpointGain(vals[i + 879])
					varObject['matrixOutFader' + vals[1]] = this.matrixGain[i]
					for (let x = 1; x <= MatrixSize; x++) {
						this.matrixXpoint[i][x] = this.calcXpointGain(vals[x + 3 + (i - 1) * MatrixSize])
						varObject['matrix' + i + 'Xpoint' + x] = this.matrixXpoint[i][x]
					}
					this.setVariableValues(varObject)
				}
				break
			// unknown data in indexes 868 - 891, 892 - 901
			// perhaps 886 - 891 are matrix output patch
			case '*GS,':
				//channel status
				//binary response
				this.log('debug', '*GS response detected. Buffer length: ' + vals.length)
				//for (let i = 0; i < vals.length; i++) {
				//	this.log('debug', 'Index: ' + i + ' value: ' + vals[i])
				//}
				break
			default:
				await this.processCmds(strRep)
		}
	},

	async processCmds(cmd) {
		let line = cmd.toString()
		let str = line.split('\r\n')
		let cmds = str[0].split(cmdSep)
		await cmds.forEach((element) => {
			this.processParams(element)
		})
		return true
	},

	async processParams(cmd) {
		let str = cmd.toString()
		let params = str.split(paramSep)
		if (params[1] == errSyntax1 || params[1] == errSyntax2 || params[1] == errRange) {
			this.log('warn', 'bad response: ' + cmd)
			return false
		}
		switch (params[0]) {
			case '*CM':
				//channel mode
				if (params.length == 3) {
					this.channelsMode[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('channelMode')
				} else {
					this.log('warn', 'Unexpected CM response: ' + str)
				}
				break
			case '*CP':
				//channel preset
				if (params.length == 3) {
					this.channelsPreset[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('channelPreset')
				} else {
					this.log('warn', 'Unexpected CP response: ' + str)
				}
				break
			case '*BP':
				//channel bypass
				if (params.length == 3) {
					this.channelsBypass[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('channelBypass')
				} else {
					this.log('warn', 'Unexpected BP response: ' + str)
				}
				break
			case '*CO':
				//channel override
				if (params.length == 3) {
					this.channelsOverride[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('channelOverride')
				} else {
					this.log('warn', 'Unexpected CO response: ' + str)
				}
				break
			case '*CW':
				//channel weight
				if (params.length == 3) {
					this.channelsWeight[Number(params[1])] = Number(params[2])
					//then push to variable
					let varObject = {}
					varObject['channelWeight' + params[1]] = Number(params[2])
					this.setVariableValues(varObject)
				} else {
					this.log('warn', 'Unexpected CW response: ' + str)
				}
				break
			case '*MR':
				//music mode
				if (params.length == 3) {
					this.channelsMusic[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('channelMusic')
				} else {
					this.log('warn', 'Unexpected MR response: ' + str)
				}
				break
			case '*NE':
				//NOM mode
				if (params.length == 3) {
					this.channelsNom[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('channelNOM')
				} else {
					this.log('warn', 'Unexpected NE response: ' + str)
				}
				break
			case '*GA':
				//group assign
				if (params.length == 3) {
					this.log('info', 'Channel: ' + params[1] + ' assigned to: ' + params[2])
					this.channelsGroupAssign[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('channelGroupAssign')
				} else {
					this.log('warn', 'Unexpected GA response: ' + str)
				}
				break
			case '*CN':
				//channel name
				if (params.length == 3) {
					this.channelsName[Number(params[1])] = params[2]
					//then push to variable
					let varObject = {}
					varObject['channelName' + params[1]] = params[2]
					this.setVariableValues(varObject)
				} else {
					this.log('warn', 'Unexpected CN response: ' + str)
				}
				break
			case '*SM':
				//group mute
				if (params.length == 2) {
					this.groupMute[1] = Number(params[1]) & grpAval
					this.groupMute[2] = Number(params[1]) & grpBval
					this.groupMute[3] = Number(params[1]) & grpCval
					this.checkFeedbacks('groupMute')
				} else {
					this.log('warn', 'Unexpected SM response: ' + str)
				}
				break
			case '*SP':
				//group preset
				if (params.length == 2) {
					this.groupPreset[1] = Number(params[1]) & grpAval
					this.groupPreset[2] = Number(params[1]) & grpBval
					this.groupPreset[3] = Number(params[1]) & grpCval
					this.checkFeedbacks('groupPreset')
				} else {
					this.log('warn', 'Unexpected SP response: ' + str)
				}
				break
			case '*SO':
				//group override
				if (params.length == 2) {
					this.groupOverride[1] = Number(params[1]) & grpAval
					this.groupOverride[2] = Number(params[1]) & grpBval
					this.groupOverride[3] = Number(params[1]) & grpCval
					this.checkFeedbacks('groupOverride')
				} else {
					this.log('warn', 'Unexpected SO response: ' + str)
				}
				break
			case '*LH':
				//last hold
				if (params.length == 2) {
					this.groupLastHold[1] = Number(params[1]) & grpAval
					this.groupLastHold[2] = Number(params[1]) & grpBval
					this.groupLastHold[3] = Number(params[1]) & grpCval
				} else {
					this.log('warn', 'Unexpected LH response: ' + str)
				}
				break
			case '*AD': //same as ME
			case '*ME':
				//automix depth
				if (params.length == 3) {
					this.groupAutomixDepth[Number(params[1])] = Number(params[2])
					let varObject = {}
					varObject['groupAD' + params[1]] = Number(params[2])
					this.setVariableValues(varObject)
				} else {
					this.log('warn', 'Unexpected AD/ME response: ' + str)
				}
				break
			case '*NL':
				//nom gain limit
				if (params.length == 3) {
					this.groupNOMgainlimit[Number(params[1])] = Number(params[2])
					let varObject = {}
					varObject['groupNOM' + params[1]] = Number(params[2])
					this.setVariableValues(varObject)
				} else {
					this.log('warn', 'Unexpected NL response: ' + str)
				}
				break
			case '*MT':
				//music system threshold
				if (params.length == 3) {
					this.groupMusicThreshold[Number(params[1])] = Number(params[2])
					let varObject = {}
					varObject['groupMST' + params[1]] = Number(params[2])
					this.setVariableValues(varObject)
				} else {
					this.log('warn', 'Unexpected MT response: ' + str)
				}
				break
			case '*MC':
				//music system threshold input
				if (params.length == 3) {
					this.groupMusicInput[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('groupMusicInput')
				} else {
					this.log('warn', 'Unexpected MXM response: ' + str)
				}
				break
			case '*MXM':
				//matrix bus mute
				if (params.length == 3) {
					this.matrixMute[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('matrixMuted')
				} else {
					this.log('warn', 'Unexpected MXM response: ' + str)
				}
				break
			case '*MXP':
				//matrix bus polarity
				if (params.length == 3) {
					this.matrixPolarity[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('matrixPolarity')
				} else {
					this.log('warn', 'Unexpected MXP response: ' + str)
				}
				break
			case '*MXV':
				//matrix bus gain
				if (params.length == 3) {
					this.matrixGain[Number(params[1])] = Number(params[2])
					let varObject = {}
					varObject['matrixOutFader' + params[1]] = Number(params[2])
					this.setVariableValues(varObject)
				} else {
					this.log('warn', 'Unexpected MXV response: ' + str)
				}
				break
			case '*MXO':
				//matrix bus ouput
				this.log('info', 'Matrix ' + params[1] + ' output patch changed to ' + params[2])
				if (params.length == 3) {
					this.matrixOutput[Number(params[1])] = Number(params[2])
					this.checkFeedbacks('matrixOutput')
				} else {
					this.log('warn', 'Unexpected MXM response: ' + str)
				}
				break
			case '*OM':
				//matrix crosspoint
				if (params.length == 4) {
					this.matrixXpoint[Number(params[1])][Number(params[2])] = Number(params[3])
					let varObject = {}
					varObject['matrix' + params[1] + 'Xpoint' + params[2]] = Number(params[3])
					this.setVariableValues(varObject)
				} else {
					this.log('warn', 'Unexpected OM response: ' + str)
				}
				break
			case '*SNC':
				//scene count
				if (params.length == 2) {
					if (isNaN(Number(params[1]))) {
						this.log('warn', 'Unexpected SNC response: ' + str)
						return false
					}
					this.setVariableValues({
						sceneCount: Number(params[1]),
					})
					this.addCmdtoQueue('SNL,1,' + Number(params[1]))
				} else {
					this.log('warn', 'Unexpected SNC response: ' + str)
				}
				break
			case '*SNA':
				//active scene
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
					this.log('warn', 'Unexpected SNA response: ' + str)
				}
				break
			case '*SNR':
				//recall scene
				if (params.length == 2) {
					let err = params[1].search('Error: scene')
					if (err == -1) {
						this.log('info', 'Scene Recalled: ' + params[1])
						this.addCmdtoQueue('SNA')
					} else {
						this.log('warn', str)
					}
				} else {
					this.log('warn', 'Unexpected SNR response: ' + str)
				}
				break
			case '*SNS':
			case '*SNN':
				//save scene
				//save new scene
				if (params.length == 2) {
					let err = params[1].search('Error: scene')
					if (err == -1) {
						this.log('info', 'New scene saved: ' + params[1])
						this.addCmdtoQueue('SNC')
						this.addCmdtoQueue('SNA')
					} else {
						this.log('warn', str)
					}
				} else {
					this.log('warn', 'Unexpected SNN/SNS response: ' + str)
				}
				break
			case '*SNE':
				//rename scene
				if (params.length == 3) {
					this.log('info', 'Scene: ' + params[1] + '. Renamed to: ' + params[2])
					this.addCmdtoQueue('SNC')
					this.addCmdtoQueue('SNA')
				} else {
					this.log('warn', 'Error response: ' + str)
				}
				break
			case '*SND':
				//delete scene
				if (params.length == 2) {
					let err = params[1].search('Error: scene')
					if (err == -1) {
						this.log('info', 'Scene Deleted: ' + params[1])
						this.addCmdtoQueue('SNC')
						this.addCmdtoQueue('SNA')
					} else {
						this.log('warn', params[1])
					}
				} else {
					this.log('warn', 'Unexpected SND response: ' + str)
				}
				break
			case '*FP':
				//channel defaults
				this.log('info', 'Channels reset to defaults. ' + str)
				this.addCmdtoQueue('SNA')
				break
			case '*RM':
				//matrix defauls
				this.log('info', 'Matrix reset to defaults. ' + str)
				break
			case '*SU':
				//subscribe unsolicited
				if (isNaN(params[1])) {
					this.log('warn', 'SU has returned an unexpected value: ' + str)
					return false
				}
				this.config.subscription = params[1]
				this.log('info', 'Subscribe unsolicited level changed. Level: ' + params[1])
				break
			case '*LG':
				//link group
				if (params.length == 2) {
					this.setVariableValues({
						linkGroup: Number(params[1]),
					})
				} else {
					this.log('warn', 'Unexpected LG response: ' + str)
				}
				break
			case '*CS':
				//clock sourse
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
					this.log('warn', 'Unexpected CS response: ' + str)
				}
				break
			case '*AM':
				//adat mirror
				if (params.length == 2) {
					this.setVariableValues({
						adatMirror: adatMirror[params[1]],
					})
				} else {
					this.log('warn', 'Unexpected AM response: ' + str)
				}
				break
			case '*CFN':
				//automix channels
				if (params.length == 2) {
					this.setVariableValues({
						channelCount: Number(params[1]),
					})
					if (Number(params[1]) != this.config.channels) {
						this.log(
							'warn',
							'Mismatch between configured channels: ' +
								this.config.channels +
								' and connected device: ' +
								Number(params[1]) +
								'. Changing configuration.'
						)
						this.config.channels = Number(params[1])
						this.initVariables()
						this.updateActions() // export actions
						this.updateFeedbacks() // export feedbacks
						//this.updateVariableDefinitions() // export variable definitions
						//this.setVariableValues(variableDefaults)
					}
				} else {
					this.log('warn', 'Unexpected CFN response: ' + str)
				}
				break
			case '*CFS':
				//input channel offset
				if (params.length == 2) {
					this.setVariableValues({
						inputOffset: Number(params[1]),
					})
				} else {
					this.log('warn', 'Unexpected CFS response: ' + str)
				}
				break
			case '*BM':
				//blink mode
				if (params.length == 2) {
					let blink = params[1] == '1' ? true : false
					this.setVariableValues({
						blinkMode: blink,
					})
				} else {
					this.log('warn', 'Unexpected BM response: ' + str)
				}
				break
			case '*DH':
				//dhcp
				if (params.length == 2) {
					let dhcp = params[1] == '1' ? true : false
					this.setVariableValues({
						master: dhcp,
					})
				} else {
					this.log('warn', 'Unexpected DH response: ' + str)
				}
				break
			case '*SC':
				//system config
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
							'Mismatch between configured model: ' +
								duganModels[this.config.model] +
								' and connected device: ' +
								duganModels[params[1]]
						)
						this.config.model = Number(params[1])
					}
					if (Number(params[12]) != this.config.channels) {
						this.log(
							'warn',
							'Mismatch between configured channels: ' +
								this.config.channels +
								' and connected device: ' +
								Number(params[12]) +
								'. Changing configuration.'
						)
						this.config.channels = Number(params[12])
						this.initVariables()
						this.updateActions() // export actions
						//this.updateFeedbacks() // export feedbacks
						this.updateVariableDefinitions() // export variable definitions
						//this.setVariableValues(variableDefaults)
					}
				} else {
					this.log('warn', 'Unexpected SC response: ' + str)
				}
				break
			case '*VE':
				//firmware versions
				if (params.length == 5) {
					this.setVariableValues({
						firmwareVersion: params[1],
						firmwareSecVersion: params[2],
						fpgaVersion: params[3],
						hardwareRevsion: params[4],
					})
				} else {
					this.log('warn', 'Unexpected VE response: ' + str)
				}
				break
			case '*CC':
				//client connections
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
					this.log('warn', 'Unexpected CC response: ' + str)
				}
				break
			case '*HW':
				//resource useage
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
					this.log('warn', 'Unexpected HW response: ' + str)
				}
				break
			case '*HR':
				//switch headroom
				this.setVariableValues({
					switchHeadroom: Number(params[1]),
				})
				break
			case '*SF':
				//sample rate
				if (params.length == 2) {
					if (params[1] == '0' || params[1] == '1') {
						this.setVariableValues({
							sampleRate: sampleRate[params[1]],
						})
					} else {
						this.setVariableValues({
							sampleRate: params[1],
						})
					}
				} else {
					this.log('warn', 'Unexpected SF response: ' + str)
				}
				break
			case '*MM':
				//master mode
				if (params.length == 2) {
					let mstSlv = Number(params[2]) == 1 ? true : false
					this.setVariableValues({
						master: mstSlv,
					})
				} else {
					this.log('warn', 'Unexpected MM response: ' + str)
				}
				break
			case '*NA':
				//system name
				if (params.length == 2) {
					this.setVariableValues({
						hostName: params[1],
					})
				} else {
					this.log('warn', 'Unexpected NA response: ' + str)
				}
				break
			case '*IP':
				//ip
				if (params.length == 5) {
					this.setVariableValues({
						ipAddress: params[2] + '.' + params[3] + '.' + params[4] + '.' + params[5],
					})
				} else {
					this.log('warn', 'Unexpected IP response: ' + str)
				}
				break
			case '*NM':
				//netmask
				if (params.length == 5) {
					this.setVariableValues({
						netMask: params[2] + '.' + params[3] + '.' + params[4] + '.' + params[5],
					})
				} else {
					this.log('warn', 'Unexpected NM response: ' + str)
				}
				break
			case '*GW':
				//gateway
				if (params.length == 5) {
					this.setVariableValues({
						gateway: params[2] + '.' + params[3] + '.' + params[4] + '.' + params[5],
					})
				} else {
					this.log('warn', 'Unexpected GW response: ' + str)
				}
				break
			case '*CNS':
				//channel name list
				if (params.length >= 4) {
					if (params.length == 3 + Number(params[2])) {
						let varObject = {}
						let startCh = Number(params[1])
						let count = Number(params[2])
						for (let i = startCh; i <= startCh + count - 1; i++) {
							varObject['channelName' + i] = params[i - startCh + 3]
							this.channelsName[i] = params[i - startCh + 3]
						}
						this.setVariableValues(varObject)
					} else {
						this.log('warn', 'Unexpected length. Expected:' + 3 + Number(params[2]) + ' Recieved : ' + params.length)
					}
				} else {
					this.log('warn', 'Unexpected CNS length: ' + str)
				}
				break
			case '*SNL':
				//scene name list
				if (params.length > 4) {
					this.sceneList = []
					for (let i = 4; i < params.length; i++) {
						this.sceneList.push({ id: params[i], label: params[i].toString() })
					}
					this.updateActions()
				} else if (params.length == 4) {
					this.log('warn', 'No custom scenes saved. ' + str)
					this.sceneList = []
					this.updateActions()
				} else {
					this.log('warn', 'Unexpected SNL response: ' + str)
				}
				break
			case '*GSA':
				//automix gains for all
				if (params.length != MaxChannelCount + 1) {
					this.log('warn', 'Unexpected GSA length: ' + params.length + ' response: ' + str)
					return false
				} else {
					let varObject = {}
					for (let i = 1; i <= this.config.channels; i++) {
						this.channelsAmixGain[i] = this.calcGain(Number(params[i]))
						this.checkFeedbacks('channelAmixGain')
						varObject['channelAmixGain' + i] = this.channelsAmixGain[i]
					}
					this.setVariableValues(varObject)
				}
				break
			case '*GSC':
				//signal clip
				if (params.length != 9) {
					this.log('warn', 'Unexpected GSC length: ' + str)
					return false
				} else {
					for (let i = 1; i < params.length; i++) {
						let flags = processBitFlags(parseInt(params[i], 16))
						if (flags == false) {
							this.log('warn', 'Unexpected response: ' + flags)
							return false
						}
						for (let y = 0; y < flags.length; y++) {
							let channel = y + 1 + (i - 1) * 8
							this.channelsClip[channel] = flags[y]
							this.log('debug', 'Channel ' + channel + ' Clip flag is ' + flags[y])
						}
					}
					this.checkFeedbacks('channelClip')
				}
				break
			case '*GSS':
			case '*GSP':
				//signal presence GSS Model E2A, E3A, GSP for Model M & N
				if (params.length != 9) {
					this.log('warn', 'Unexpected GSS/GSP length: ' + str)
					return false
				} else {
					for (let i = 1; i < params.length; i++) {
						let flags = processBitFlags(parseInt(params[i], 16))
						if (flags == false) {
							this.log('warn', 'Unexpected response: ' + flags)
							return false
						}
						for (let y = 0; y < flags.length; y++) {
							let channel = y + 1 + (i - 1) * 8
							this.channelsPresence[channel] = flags[y]
							this.log('debug', 'Channel ' + channel + ' Signal flag is ' + flags[y])
						}
					}
					this.checkFeedbacks('channelPresence')
				}
				break
			case '*GSI':
				//input peaks
				if (params.length != MaxChannelCount + 1) {
					this.log('warn', 'Unexpected GSI length: ' + params.length + ' response: ' + str)
					return false
				} else {
					let varObject = {}
					for (let i = 1; i <= this.config.channels; i++) {
						this.channelsInputPeak[i] = this.calcGain(Number(params[i]))
						this.checkFeedbacks('channelInputPeak')
						varObject['channelInputLevel' + i] = this.channelsInputPeak[i]
					}
					this.setVariableValues(varObject)
				}
				break
			case '*GSO':
				//output peaks
				if (params.length != MaxChannelCount + 1) {
					this.log('warn', 'Unexpected GSO length: ' + params.length + ' response: ' + str)
					return false
				} else {
					let varObject = {}
					for (let i = 1; i <= this.config.channels; i++) {
						this.channelsOutputPeak[i] = this.calcGain(Number(params[i]))
						this.checkFeedbacks('channelOutputPeak')
						varObject['channelOutputLevel' + i] = this.channelsOutputPeak[i]
					}
					this.setVariableValues(varObject)
				}
				break
			case '*GSM':
				//music reference peaks
				if (params.length != GroupCount + 1) {
					this.log('warn', 'Unexpected GSM length: ' + params.length + ' response: ' + str)
					return false
				} else {
					let varObject = {}
					for (let i = 1; i <= GroupCount; i++) {
						this.groupMusicPeak[i] = this.calcGain(Number(params[i]))
						this.checkFeedbacks('groupMusicPeak')
						varObject['groupMSTgain' + i] = this.groupMusicPeak[i]
					}
					this.setVariableValues(varObject)
				}
				break
			case '*GSN':
				//nom gain limits
				if (params.length != GroupCount + 1) {
					this.log('warn', 'Unexpected GSN length: ' + params.length + ' response: ' + str)
					return false
				} else {
					let varObject = {}
					for (let i = 1; i <= GroupCount; i++) {
						this.groupNOMpeak[i] = this.calcGain(Number(params[i]))
						this.checkFeedbacks('groupNOMgain')
						varObject['groupNOMpeak' + i] = this.groupNOMpeak[i]
					}
					this.setVariableValues(varObject)
				}
				break
			case '*GSX':
				//matrix output meters
				if (params.length != MatrixCount + 1) {
					this.log('warn', 'Unexpected GSX length: ' + params.length + ' response: ' + str)
					return false
				} else {
					let varObject = {}
					for (let i = 1; i <= MatrixCount; i++) {
						this.matrixOutputPeak[i] = this.calcGain(Number(params[i]))
						this.checkFeedbacks('matrixLevel')
						varObject['matrixOutLevel' + i] = this.matrixOutputPeak[i]
					}
					this.setVariableValues(varObject)
				}
				break
			default:
				if (cmd != welcomeMessage) {
					this.log('warn', 'Unexpected response from unit: ' + cmd)
				} else {
					this.log('info', cmd)
				}
		}
	},
}
