const { InstanceStatus, TCPHelper } = require('@companion-module/base')
const { EndSession, msgDelay, EOM, cmdOnConnect, cmdOnPollInterval, paramSep } = require('./consts.js')

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
		}, msgDelay[this.config.rate])
	},

	async sendCommand(cmd) {
		//this.log('debug', 'sendCommand')
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
		//this.log('debug', 'pollStatus')
		cmdOnPollInterval.forEach((element) => {
			this.addCmdtoQueue(element)
		})
		let nameQuery = Math.ceil(this.config.channels / 16)
		for (let i = 1; i <= nameQuery; i++) {
			let startCh = 1 + (i - 1) * 16
			let count = 16
			if (startCh + count - 1 > this.config.channels) {
				count = this.config.channels - startCh + 1
			}
			this.addCmdtoQueue('CNS' + paramSep + startCh + paramSep + count)
		}
		this.keepAliveTimer = setTimeout(() => {
			this.pollStatus()
		}, this.config.keepAlive * 1000)
	},

	initTCP() {
		//this.log('debug', 'initTCP')
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
				if (this.config.keepAlive > 0) {
					this.keepAliveTimer = setTimeout(() => {
						this.pollStatus()
					}, this.config.keepAlive * 1000)
				}
				this.queryOnConnect()
			})
			this.socket.on('data', (chunk) => {
				console.log('Data received')
				console.log(chunk)
				this.processBuffer(chunk)
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	},
}
