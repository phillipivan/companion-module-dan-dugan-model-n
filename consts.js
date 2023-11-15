export const regexpCmd = new RegExp(/(^[*])([a-zA-Z]{0,3})([,])/g)
export const regexpSafeString = new RegExp(/^[^,*;:]{1,16}/g)
export const msgDelay = 50 //Dugan advice is 50ms minimum
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
export const grpAval = 1
export const grpBval = 2
export const grpCval = 4
export const toggle = 10
export const noChange = 11
export const MatrixCount = 6
export const MatrixSize = 144
export const EndSession = 'QUIT' //'EXIT' also works
export const EOM = '\r\n'
export const paramSep = ',' //seperator between parameters
export const cmdSep = ';' //seperator between responses when multiple sent in 1 message
// eslint-disable-next-line prettier/prettier
export const cmdOnConnect = ['SC', 'VE', 'BM', 'HW', 'HR', 'SNC', 'SNA', 'GP', 'LG', 'CS', 'AM', 'CC', 'SU,1', 'SF', 'MM', 'CFS', 'BM'] //queries to be made on initial connection
export const cmdOnPollInterval = ['HW', 'SNC', 'SNA', 'CC'] //queries to be made each poll interval
export const errSyntax1 = 'Error: syntax'
export const errSyntax2 = 'ERROR: syntax'
export const errRange = 'Error: Channel number out of range'
export const sampleRate = ['48kHz', '96kHz']
export const adatMirror = ['0 Channels', '8 Channels', '16 Channels']
export const clockSources = ['Dante/Madi', 'Word Clock', 'Internal', 'ADAT']
export let automixChannels = []
automixChannels.push({ id: 1, label: 'Unit Default' })
for (let i = MinChannelCount; i <= MaxChannelCount; i++) {
	automixChannels.push({ id: i, label: i + ' Automix Channels' })
}
