export const regexpCmd = new RegExp(/(^[*])([a-zA-Z]{0,3})([,])/g)
export const regexpSafeString = new RegExp(/^[^,*;]{1,15}/g)
export const msgDelay = 50 //Dugan advice is 50
export const duganModels = [
	'0',
	'1',
	'2',
	'3',
	'Model-E1',
	'Dugan-MY16',
	'Model-E1A',
	'Model-E2',
	'Model-E3',
	'Model-VN',
	'10',
	'Model-M',
	'Model-N',
]
export const duganChannels = [8, 8, 8, 8, 8, 16, 8, 28, 32, 16, 8, 64, 64]
export const MaxChannelCount = 64
export const MinChannelCount = 8
export const GroupCount = 3
export const MatrixCount = 6
export const EndSession = 'QUIT'
export const EOM = '\r\n'
export const paramSep = ','
export let automixChannels = []
automixChannels.push({ id: 1, label: 'Unit Default' })
for (let i = MinChannelCount; i <= MaxChannelCount; i++) {
	automixChannels.push({ id: i, label: i + ' Automix Channels' })
}
