module.exports = async function (self) {
	self.setVariableDefinitions([
		{ variableId: 'deviceType', name: 'Device Type' },
		{ variableId: 'hostName', name: 'Host Name' },
		{ variableId: 'serialNumber', name: 'Serial Number' },
		{ variableId: 'firmwareVersion', name: 'Firmware Version' },
		{ variableId: 'fpgaVersion', name: 'FPGA Version' },
		{ variableId: 'hardwareRevsion', name: 'Hardware Revsion' },
		{ variableId: 'macAddress', name: 'MAC Address' },
		{ variableId: 'ipAddress', name: 'IP Address' },
		{ variableId: 'netMask', name: 'Subnet Mask' },
		{ variableId: 'gateway', name: 'Gateway' },
		{ variableId: 'dhcp', name: 'DHCP' },
		{ variableId: 'channelCount', name: 'Channel Count' },
	])
}
