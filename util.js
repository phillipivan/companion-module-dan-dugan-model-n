const { regexpCmd, regexpSafeString } = require('./consts.js')
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
}
