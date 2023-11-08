/* eslint-disable prettier/prettier */
const variableDefaults = {
    deviceType: 'unknown',
    hostName: 'unknown',
    serialNumber: 'unknown',
    firmwareVersion: '-',
    fpgaVersion: '-',
    hardwareRevsion: '-',
    macAddress: '-',
    ipAddress: this.config.host,
    netMask: "(none)",
    gateway: "",
    dhcp: "(none)",
    channelCount: this.config.channelCount,
};

module.exports = variableDefaults;