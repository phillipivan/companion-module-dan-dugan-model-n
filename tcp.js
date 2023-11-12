const { InstanceStatus, TCPHelper } = require('@companion-module/base')
const { duganModels, EndSession, msgDelay, EOM, cmdOnConnect, cmdOnPollInterval } = require('./consts.js')

module.exports = {
	async addCmdtoQueue(cmd) {
		//this.log('debug', 'addCmdtoQueue: ' + cmd)
		if (cmd !== undefined && cmd.length >= 1) {
			await this.cmdQueue.push(cmd)
			return true
		}
		this.log('warn', 'Invalid command: ' + cmd)
		return false
	},

	async processCmdQueue() {
		//this.log('debug', 'processCmdQueue. Queue length: ' + this.cmdQueue.length)
		if (this.cmdQueue.length > 0) {
			let txCmd = await this.cmdQueue.splice(0, 1)
			this.sendCommand(txCmd)
		}
		this.cmdTimer = setTimeout(() => {
			this.processCmdQueue()
		}, msgDelay)
	},

	async sendCommand(cmd) {
		this.log('debug', 'sendCommand')
		if (cmd !== undefined) {
			if (this.socket !== undefined && this.socket.isConnected) {
				this.log('info', 'Sending Command: ' + cmd)
				this.socket.send(cmd + EOM)
				return true
			} else {
				this.log('warn', 'Socket not connected, tried to send: ' + cmd)
			}
		} else {
			this.log('warn', 'Command undefined')
		}
		return false
	},

	//queries made on initial connection.
	queryOnConnect() {
		cmdOnConnect.forEach((element) => {
			this.addCmdtoQueue(element)
		})
		return true
	},

	pollStatus() {
		this.log('debug', 'pollStatus')
		cmdOnPollInterval.forEach((element) => {
			this.addCmdtoQueue(element)
		})
		this.keepAliveTimer = setTimeout(() => {
			this.pollStatus()
		}, this.config.keepAlive * 1000)
	},

	initTCP() {
		this.log('debug', 'initTCP')
		if (this.socket !== undefined) {
			this.addCmdtoQueue(EndSession)
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
				this.queryOnConnect()
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
	},
}
