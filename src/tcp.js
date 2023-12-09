const { InstanceStatus, TCPHelper } = require('@companion-module/base')
const { msgDelay, EOM, cmdOnConnect, cmdOnPollInterval, paramSep, meterCommands, cmd } = require('./consts.js')

module.exports = {
	async addCmdtoQueue(cmd) {
		if (cmd !== undefined && cmd.length >= 1) {
			await this.cmdQueue.push(cmd)
			return true
		}
		this.log('warn', `Invalid command: ${cmd}`)
		return false
	},

	async processCmdQueue() {
		if (this.cmdQueue.length > 0 && this.clearToTx) {
			//dont send command if still waiting for response from last command
			this.sendCommand(await this.cmdQueue.splice(0, 1))
			this.cmdTimer = setTimeout(() => {
				this.processCmdQueue()
			}, msgDelay[this.config.rate])
			return true
		}
		// check queue at double speed while idle for better responsiveness
		this.cmdTimer = setTimeout(() => {
			this.processCmdQueue()
		}, msgDelay[this.config.rate] / 2)
		return false
	},

	async sendCommand(cmd) {
		if (cmd !== undefined) {
			if (this.socket !== undefined && this.socket.isConnected) {
				//this.log('debug', `Sending Command: ${cmd}`)
				this.clearToTx = false
				this.socket.send(cmd + EOM)
				return true
			} else {
				this.log('warn', `Socket not connected, tried to send: ${cmd}`)
			}
		} else {
			this.log('warn', 'Command undefined')
		}
		return false
	},

	async getNames() {
		let nameQuery = Math.ceil(this.config.channels / 16)
		for (let i = 1; i <= nameQuery; i++) {
			let startCh = 1 + (i - 1) * 16 //dugan software queries names in blocks of 16
			let count = 16
			if (startCh + count - 1 > this.config.channels) {
				count = this.config.channels - startCh + 1
			}
			await this.addCmdtoQueue(`${cmd.channel.nameList}${paramSep}${startCh}${paramSep}${count}`)
		}
		return true
	},

	//queries made on initial connection.
	async queryOnConnect() {
		clearTimeout(this.keepAliveTimer)
		clearTimeout(this.meterTimer)
		cmdOnConnect.forEach((element) => {
			this.addCmdtoQueue(element)
		})
		this.config.subscription = this.config.subscription == undefined ? 1 : this.config.subscription
		this.addCmdtoQueue(`${cmd.system.subscribe}${paramSep}${this.config.subscription}`)
		await this.getNames()
		await this.subscribeFeedbacks()
		await this.subscribeActions()
		if (this.config.model == 11 || this.config.model == 12) {
			this.addCmdtoQueue(cmd.matrix.bulkParams) //only query matrix params if connected to model M or N
		}
		for (let i = 1; i <= this.config.channels; i++) {
			await this.addCmdtoQueue(`${cmd.channel.weight}${paramSep}${i}`)
		}
		if (this.config.keepAlive > 0) {
			this.keepAliveTimer = setTimeout(() => {
				this.pollStatus()
			}, this.config.keepAlive * 1000)
		}
		if (this.config.meterRate >= 100) {
			this.meterTimer = setTimeout(() => {
				this.checkMeters()
			}, this.config.meterRate)
		}
		return true
	},

	pollStatus() {
		cmdOnPollInterval.forEach((element) => {
			this.addCmdtoQueue(element)
		})
		this.getNames()
		this.keepAliveTimer = setTimeout(() => {
			this.pollStatus()
		}, this.config.keepAlive * 1000)
	},

	checkMeters() {
		if (this.config.model == 4 || this.config.model == 5 || this.config.model == 6 || this.config.model == 9) {
			return false //units do not support these metering commands
		}
		meterCommands.forEach((element) => {
			this.addCmdtoQueue(element)
		})
		if (this.config.meterRate >= 100) {
			this.meterTimer = setTimeout(() => {
				this.checkMeters()
			}, this.config.meterRate)
		}
		return true
	},

	initTCP() {
		if (this.socket !== undefined) {
			this.addCmdtoQueue(cmd.system.endSession)
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
				this.clearToTx = true
				clearTimeout(this.keepAliveTimer)
				clearTimeout(this.meterTimer)
			})
			this.socket.on('connect', () => {
				this.log('info', 'Connected')
				this.clearToTx = true
				this.queryOnConnect()
			})
			this.socket.on('data', (chunk) => {
				this.clearToTx = true
				this.processBuffer(chunk)
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	},
}
