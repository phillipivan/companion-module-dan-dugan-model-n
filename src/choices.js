const { grpAval, grpBval, grpCval, toggle, noChange, duganModels } = require('./consts.js')
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
		{ id: 'FP', label: 'Channel Defaults' },
		{ id: 'RM', label: 'Matrix Defaults' },
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
		{ id: 'SC', label: 'System Configuration' },
		{ id: 'VE', label: 'Firmware Versions' },
		{ id: 'CC', label: 'Client Connections' },
		{ id: 'HW', label: 'Resource Useage' },
		{ id: 'HR', label: 'Switch Headroom' },
		{ id: 'SF', label: 'Sample Rate' },
		{ id: 'MM', label: 'Master' },
	],
	system_network: [
		{ id: 'IP', label: 'IP Address' },
		{ id: 'NM', label: 'Subnet Mask' },
		{ id: 'GW', label: 'Gateway' },
	],
	query_meters: [
		{ id: 'GS', label: 'Channel Status' },
		{ id: 'GSA', label: 'Automix Gains' },
		//{ id: 'GSC', label: 'Signal Clip' }, Dugan responds with *GSS, which makes it hard to parse.
		{ id: 'GSS', label: 'Signal Presence' },
		{ id: 'GSI', label: 'Input Peaks' },
		{ id: 'GSO', label: 'Output Peaks' },
		{ id: 'GSM', label: 'Music Reference Peaks' },
		{ id: 'GSN', label: 'NOM Gain Limits' },
		{ id: 'GSX', label: 'Matrix Output Meters' },
	],
	query_namelistmode: [
		{ id: 'CNS', label: 'Channels' },
		{ id: 'SNL', label: 'Scenes' },
	],
	system_bulkconfig: [
		{ id: 'GP', label: 'Channels Parameters' },
		{ id: 'GM', label: 'Matrix Crosspoints' },
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
