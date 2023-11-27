const { MaxChannelCount, MatrixCount, MatrixSize, GroupCount } = require('./consts.js')

module.exports = async function (self) {
	let varList = [
		{ variableId: 'deviceType', name: 'Device Type' },
		{ variableId: 'hostName', name: 'Host Name' },
		{ variableId: 'serialNumber', name: 'Serial Number' },
		{ variableId: 'firmwareVersion', name: 'Firmware Version' },
		{ variableId: 'firmwareSecVersion', name: 'Secondary Firmware Version' },
		{ variableId: 'fpgaVersion', name: 'FPGA Version' },
		{ variableId: 'hardwareRevsion', name: 'Hardware Revsion' },
		{ variableId: 'macAddress', name: 'MAC Address' },
		{ variableId: 'ipAddress', name: 'IP Address' },
		{ variableId: 'netMask', name: 'Subnet Mask' },
		{ variableId: 'gateway', name: 'Gateway' },
		{ variableId: 'dhcp', name: 'DHCP' },
		{ variableId: 'channelCount', name: 'Channel Count' },
		{ variableId: 'linkGroup', name: 'Link Group' },
		{ variableId: 'clockSource', name: 'Clock Source' },
		{ variableId: 'adatMirror', name: 'ADAT Mirror' },
		{ variableId: 'inputOffset', name: 'Input Channel Offset' },
		{ variableId: 'blinkMode', name: 'Blink Mode' },
		{ variableId: 'clientUDP', name: 'UDP Clients' },
		{ variableId: 'clientTCP', name: 'TCP Clients' },
		{ variableId: 'sampleRate', name: 'Sample Rate' },
		{ variableId: 'switchHeadroom', name: 'Switch Headroom' },
		{ variableId: 'master', name: 'Master' },
		{ variableId: 'heartBeat', name: 'HeartBeat' },
		{ variableId: 'lwip', name: 'LWIP' },
		{ variableId: 'dsp', name: 'DSP' },
		{ variableId: 'tcpip', name: 'TCPIP' },
		{ variableId: 'macRX', name: 'Mac RX' },
		{ variableId: 'macTX', name: 'Mac TX' },
		{ variableId: 'rtosHeapFree', name: 'RTOS Heap Free' },
		{ variableId: 'mallocHeadFree', name: 'Malloc Heap Free' },
		{ variableId: 'sceneCount', name: 'Scene Count' },
		{ variableId: 'sceneActive', name: 'Active Scene' },
		{ variableId: 'sceneActiveIndex', name: 'Active Scene Index' },
		{ variableId: 'sceneActiveChanged', name: 'Active Scene Changed' },
	]
	for (let i = 1; i <= MaxChannelCount; i++) {
		varList.push(
			{ variableId: 'channelName' + i, name: 'Channel ' + i + ' Name' },
			{ variableId: 'channelWeight' + i, name: 'Channel ' + i + ' Weight' },
			{ variableId: 'channelAmixGain' + i, name: 'Channel ' + i + ' Gain Reduction' },
			{ variableId: 'channelInputLevel' + i, name: 'Channel ' + i + ' Input Level' },
			{ variableId: 'channelOutputLevel' + i, name: 'Channel ' + i + ' Output Level' }
		)
	}
	for (let i = 1; i <= MatrixCount; i++) {
		varList.push(
			{ variableId: 'matrixOutFader' + i, name: 'Matrix ' + i + ' Fader' },
			{ variableId: 'matrixOutLevel' + i, name: 'Matrix ' + i + ' Output Level' }
		)
		for (let x = 1; x <= MatrixSize; x++) {
			varList.push({ variableId: 'matrix' + i + 'Xpoint' + x, name: 'Matrix ' + i + ' Crosspoint ' + x })
		}
	}
	for (let i = 1; i <= GroupCount; i++) {
		varList.push(
			{ variableId: 'groupNOM' + i, name: 'Group ' + i + ' NOM Limit' },
			{ variableId: 'groupNOMpeak' + i, name: 'Group ' + i + ' NOM Peak' },
			{ variableId: 'groupAD' + i, name: 'Group ' + i + ' Automix Depth' },
			{ variableId: 'groupMST' + i, name: 'Group ' + i + ' Music System Threshold' },
			{ variableId: 'groupMSTgain' + i, name: 'Group ' + i + ' Music System Gain' }
		)
	}
	self.setVariableDefinitions(varList)
}
