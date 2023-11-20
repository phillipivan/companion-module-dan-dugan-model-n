const { regexpCmd, regexpSafeString, paramSep } = require('./consts.js')
module.exports = {
	regexCmd(cmd) {
		this.log('debug', 'regexCmd')
		let command
		let safeCommand
		while ((command = regexpCmd.exec(cmd)) !== null) {
			safeCommand = command[0]
		}
		safeCommand = safeCommand != undefined ? safeCommand : false
		return safeCommand
	},
	regexSafeString(dirtyString) {
		this.log('debug', 'regexSafeString')
		let str
		let safeString
		while ((str = regexpSafeString.exec(dirtyString)) !== null) {
			safeString = str[0]
		}
		safeString = safeString != undefined ? safeString : false
		return safeString
	},
	calcGain(val) {
		if (isNaN(val)) {
			this.log('warn', 'calcGain has been passed a Nan: ' + val)
			return false
		}
		if (val < 0 || val > 255) {
			this.log('warn', 'calcGain has been passed an out of range number: ' + val)
			return false
		}
		let gain = 0 - val / 2 //common gain algo for many dugan functions
		return gain
	},
	calcXpointGain(val) {
		if (isNaN(val)) {
			this.log('warn', 'calcXpointGain has been passed a Nan: ' + val)
			return false
		}
		if (val < 0 || val > 255) {
			this.log('warn', 'calcXpointGain has been passed an out of range number: ' + val)
			return false
		}
		let gain = (val - 192) / 2 //common gain algo for dugan matrix crosspoints
		return gain
	},
	processBitFlags(val) {
		if (isNaN(val)) {
			this.log('warn', 'processBitFlags has been passed a Nan: ' + val)
			return false
		}
		if (val < 0 || val > 255) {
			this.log('warn', 'processBitFlags has been passed an out of range number: ' + val)
			return false
		}
		let flags = []
		let operators = [1, 2, 4, 8, 16, 32, 64, 128]
		for (let i = 0; i < operators.length; i++) {
			let x = val & operators[i]
			flags[i] = x == operators[i] ? true : false
		}
		return flags
	},
	process2BitFlags(val) {
		if (isNaN(val)) {
			this.log('warn', 'processBitFlags has been passed a Nan: ' + val)
			return false
		}
		if (val < 0 || val > 255) {
			this.log('warn', 'processBitFlags has been passed an out of range number: ' + val)
			return false
		}
		let flags = []
		let operators = [3, 12, 48, 192]
		let base = [1, 4, 16, 64]
		for (let i = 0; i < operators.length; i++) {
			let x = val & operators[i]
			flags[i] = x / base[i]
		}
		return flags
	},
	checkSubscriptionLevel(val) {
		if (isNaN(val)) {
			return undefined
		}
		if (val < 0 || val > 2) {
			return undefined
		}
		if (this.config.subscription >= val) {
			return true
		}
		this.addCmdtoQueue('SU' + paramSep + val)
		return val
	},
}
