const { InstanceStatus, TCPHelper } = require('@companion-module/base')
const { EndSession, msgDelay, EOM, cmdOnConnect, cmdOnPollInterval, paramSep } = require('./consts.js')

module.exports = {
	async addCmdtoQueue(cmd) {
		//this.log('debug', 'addCmdtoQueue: ' + cmd)
		if (cmd !== undefined && cmd.length >= 1) {
			await this.cmdQueue.push(cmd)
			return true
		}
		this.log('warn', `Invalid command: ${cmd}`)
		return false
	},

	async processCmdQueue() {
		if (this.cmdQueue.length > 0) {
			this.sendCommand(await this.cmdQueue.splice(0, 1))
		}
		this.cmdTimer = setTimeout(() => {
			this.processCmdQueue()
		}, msgDelay[this.config.rate])
	},

	async sendCommand(cmd) {
		//this.log('debug', 'sendCommand')
		if (cmd !== undefined) {
			if (this.socket !== undefined && this.socket.isConnected) {
				this.log('info', `Sending Command: ${cmd}`)
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
			await this.addCmdtoQueue(`CNS${paramSep}${startCh}${paramSep}${count}`)
		}
	},

	//queries made on initial connection.
	queryOnConnect() {
		cmdOnConnect.forEach((element) => {
			this.addCmdtoQueue(element)
		})
		//this.config.subscription = this.config.subscription == undefined ? 1 : this.config.subscription
		this.addCmdtoQueue(`SU${paramSep}${this.config.subscription}`)
		this.getNames()
		this.subscribeFeedbacks()
		if (this.config.model == 11 || this.config.model == 12) {
			this.addCmdtoQueue('GM') //only query matrix params if connected to model M or N
		}
		for (let i = 1; i <= this.config.channels; i++) {
			this.addCmdtoQueue(`SU${paramSep}${i}`)
		}
		return true
	},

	pollStatus() {
		//this.log('debug', 'pollStatus')
		cmdOnPollInterval.forEach((element) => {
			this.addCmdtoQueue(element)
		})
		this.getNames()
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
				/*let i = 0
				let line = ''
				let offset = 0
				let receivebuffer = ''
				receivebuffer += chunk
				while ((i = receivebuffer.indexOf('\r\n', offset)) !== -1) {
					line = receivebuffer.slice(offset, i - offset)
					offset = i + 2
					this.processBuffer(line)
				}
				receivebuffer = receivebuffer.slice(offset)
				if (receivebuffer.length > 12) {
					this.processBuffer(receivebuffer)
					receivebuffer = null
				}*/
				this.processBuffer(chunk)
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	},
}
