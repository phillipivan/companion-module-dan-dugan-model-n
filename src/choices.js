const { grpAval, grpBval, grpCval, toggle, noChange, duganModels, cmd } = require('./consts.js')
module.exports = {
	channel_modes: [
		{ id: 0, label: 'Manual' },
		{ id: 1, label: 'Auto' },
		{ id: 2, label: 'Mute' },
	],
	channel_bypass: [
		{ id: 0, label: 'On' },
		{ id: 1, label: 'Bypass' },
		{ id: toggle, label: 'Toggle' },
	],
	channel_override: [
		{ id: 0, label: 'Normal' },
		{ id: 1, label: 'Override' },
		{ id: toggle, label: 'Toggle' },
	],
	channel_offOnToggle: [
		{ id: 0, label: 'Off' },
		{ id: 1, label: 'On' },
		{ id: toggle, label: 'Toggle' },
	],
	groupA_mute: [
		{ id: 0, label: 'On' },
		{ id: grpAval, label: 'Mute' },
		{ id: toggle, label: 'Toggle' },
		{ id: noChange, label: 'No Change' },
	],
	groupB_mute: [
		{ id: 0, label: 'On' },
		{ id: grpBval, label: 'Mute' },
		{ id: toggle, label: 'Toggle' },
		{ id: noChange, label: 'No Change' },
	],
	groupC_mute: [
		{ id: 0, label: 'On' },
		{ id: grpCval, label: 'Mute' },
		{ id: toggle, label: 'Toggle' },
		{ id: noChange, label: 'No Change' },
	],
	groupA_preset: [
		{ id: 0, label: 'On' },
		{ id: grpAval, label: 'Preset' },
		{ id: toggle, label: 'Toggle' },
		{ id: noChange, label: 'No Change' },
	],
	groupB_preset: [
		{ id: 0, label: 'On' },
		{ id: grpBval, label: 'Preset' },
		{ id: toggle, label: 'Toggle' },
		{ id: noChange, label: 'No Change' },
	],
	groupC_preset: [
		{ id: 0, label: 'On' },
		{ id: grpCval, label: 'Preset' },
		{ id: toggle, label: 'Toggle' },
		{ id: noChange, label: 'No Change' },
	],
	groupA_override: [
		{ id: 0, label: 'On' },
		{ id: grpAval, label: 'Override' },
		{ id: toggle, label: 'Toggle' },
		{ id: noChange, label: 'No Change' },
	],
	groupB_override: [
		{ id: 0, label: 'On' },
		{ id: grpBval, label: 'Override' },
		{ id: toggle, label: 'Toggle' },
		{ id: noChange, label: 'No Change' },
	],
	groupC_override: [
		{ id: 0, label: 'On' },
		{ id: grpCval, label: 'Override' },
		{ id: toggle, label: 'Toggle' },
		{ id: noChange, label: 'No Change' },
	],
	groupA_lasthold: [
		{ id: 0, label: 'On' },
		{ id: grpAval, label: 'Last Hold' },
		{ id: toggle, label: 'Toggle' },
		{ id: noChange, label: 'No Change' },
	],
	groupB_lasthold: [
		{ id: 0, label: 'On' },
		{ id: grpBval, label: 'Last Hold' },
		{ id: toggle, label: 'Toggle' },
		{ id: noChange, label: 'No Change' },
	],
	groupC_lasthold: [
		{ id: 0, label: 'On' },
		{ id: grpCval, label: 'Last Hold' },
		{ id: toggle, label: 'Toggle' },
		{ id: noChange, label: 'No Change' },
	],
	system_defaults: [
		{ id: cmd.scene.defaults, label: 'Channel Defaults' },
		{ id: cmd.matrix.defaults, label: 'Matrix Defaults' },
	],
	system_subscribe: [
		{ id: 0, label: 'Off' },
		{ id: 1, label: 'On' },
		//{ id: 2, label: 'On with metering' },
	],
	system_adatMirror: [
		{ id: 1, label: '8 Channels' },
		{ id: 2, label: '16 Channels' },
	],
	system_blinkmode: [
		{ id: 0, label: 'Off' },
		{ id: 1, label: 'On' },
	],
	system_dhcp: [
		{ id: 0, label: 'Off' },
		{ id: 1, label: 'On' },
	],
	system_query: [
		{ id: cmd.system.config, label: 'System Configuration' },
		{ id: cmd.system.firmware, label: 'Firmware Versions' },
		{ id: cmd.system.connections, label: 'Client Connections' },
		{ id: cmd.system.resourceUseage, label: 'Resource Useage' },
		{ id: cmd.system.switchHeadroom, label: 'Switch Headroom' },
		{ id: cmd.system.sampleRate, label: 'Sample Rate' },
		{ id: cmd.system.master, label: 'Master' },
	],
	system_network: [
		{ id: cmd.system.ip, label: 'IP Address' },
		{ id: cmd.system.netmask, label: 'Subnet Mask' },
		{ id: cmd.system.gateway, label: 'Gateway' },
	],
	query_meters: [
		{ id: cmd.metering.channelStatus, label: 'Channel Status' },
		{ id: cmd.metering.automixGain, label: 'Automix Gains' },
		//{ id: cmd.metering.signalClip, label: 'Signal Clip' }, Dugan responds with *GSS, which makes it hard to parse.
		{ id: cmd.metering.signalPresense, label: 'Signal Presence' },
		{ id: cmd.metering.inputPeaks, label: 'Input Peaks' },
		{ id: cmd.metering.outputPeaks, label: 'Output Peaks' },
		{ id: cmd.metering.musicRef, label: 'Music Reference Peaks' },
		{ id: cmd.metering.nomGain, label: 'NOM Gain Limits' },
		{ id: cmd.metering.matrixOutput, label: 'Matrix Output Meters' },
	],
	query_namelistmode: [
		{ id: cmd.channel.nameList, label: 'Channels' },
		{ id: cmd.scene.nameList, label: 'Scenes' },
	],
	system_bulkconfig: [
		{ id: cmd.channel.bulkParams, label: 'Channels Parameters' },
		{ id: cmd.matrix.bulkParams, label: 'Matrix Crosspoints' },
	],
	config_duganModels: [
		{ id: 11, label: duganModels[11] },
		{ id: 12, label: duganModels[12] },
	],
	config_messagingrate: [
		{ id: 0, label: 'Fast' },
		{ id: 1, label: 'Medium' },
		{ id: 2, label: 'Slow' },
		{ id: 3, label: 'Very Slow' },
	],
	config_meterInterval: [
		{ id: 0, label: 'Off' },
		{ id: 250, label: '250 ms' },
		{ id: 500, label: '500 ms' },
		{ id: 1000, label: '1 Seconds' },
		{ id: 2000, label: '2 Seconds' },
		{ id: 4000, label: '4 Seconds' },
	],
	config_subscribe: [
		{ id: 0, label: 'Off' },
		{ id: 1, label: 'On' },
		//{ id: 2, label: 'On with Metering' },
	],
}
