const { regexpCmd, regexpSafeString } = require('./consts.js')
module.exports = {
	regexCmd(cmd) {
		this.log('debug', 'regexCmd')
		let command
		let safeCommand
		while ((command = regexpCmd.exec(cmd)) !== null) {
			safeCommand = command[0]
		}
		if (safeCommand != undefined) {
			this.log('debug', 'Command Found: ' + safeCommand)
			return safeCommand
		} else {
			return 'cmdNotFound'
		}
	},
	regexSafeString(dirtyString) {
		this.log('debug', 'regexSafeString')
		let str
		let safeString
		while ((str = regexpSafeString.exec(dirtyString)) !== null) {
			safeString = str[0]
		}
		if (safeString != undefined) {
			return safeString
		} else {
			return false
		}
	},
}
