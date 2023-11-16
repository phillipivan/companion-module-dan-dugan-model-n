const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		sceneChanged: {
			name: 'Scene, Has Changed',
			type: 'boolean',
			label: 'Scene, Has Changed',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [],
			callback: (_feedback) => {
				if (self.sceneChanged == 1) {
					return true
				} else {
					return false
				}
			},
		},
		matrixMuted: {
			name: 'Matrix Output Mute',
			type: 'boolean',
			label: 'Matrix Output Mute',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Matrix',
					id: 'matrix',
					default: 1,
					choices: self.matrixNames,
				},
			],
			callback: ({ options }) => {
				if (self.matrixMute[options.matrix] == 1) {
					return true
				} else {
					return false
				}
			},
		},
	})
}
