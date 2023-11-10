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
}
