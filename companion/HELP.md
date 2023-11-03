## Dan Dugan Sound Design Model N Automixer

This module will control the Model M or N automixer. There are 64 Madi or Dante inputs & outputs, and 16 adat inputs and outputs.
Most functions will work with the Dugan-MY16 .

- [Dugan Auto Mixer Product Page](https://www.dandugan.com/products/)

## Configuration
Enter the IP address of the control port of the Automixer. The unit will accept connections on TCP:23 or TCP:9776 (and UDP:9776, not supported here). This model defaults to TCP:23 for easiest integration with firewalls and complex networks. Keep alive will poll system parameters at the set interval.

## Actions
- **Channel - Mode** Query / Change Channel Mode: Manual, Auto, Mute
- **Channel - Preset** Query / Change Channel Preset: Manual, Auto, Mute
- **Channel - Bypass** Query / Change Channel Bypass
- **Channel - Over ride** Query / Change Channel Over ride
- **Channel - Weight** Query / Change Channel Weight. Float from -100.00 dB to +20.00 dB
- **Channel - Music** Query / Change Channel Music Mode
- **Channel - NOM** Query / Change Channel NOM Mode
- **Channel - Group Assignment** Query / Change Channel Group Assignment
- **Channel - Name** Query / Change Channel Name - up to 15 characters.  Accepts variables

- **Group - Mute** Query / Change Group Mute
- **Group - Preset** Query / Change Group Preset
- **Group - Over ride** Query / Change Group Over ride
- **Group - Last Hold** Query / Change Group Last Hold
- **Group - Automix Depth** Query / Change Group Automix Depth
- **Group - NOM Gain Limit** Query / Change Group Gain Limit
- **Group - Music System Threshold** Query / Change Group Music System Threshold
- **Group - MST Input** Query / Change Group Music System Threshold Input

- **Matrix - Mute** Query / Change Matrix Mute
- **Matrix - Polarity** Query / Change Matrix Polarity
- **Matrix - Gain** Query / Change Matrix Gain
- **Matrix - Output** Query / Change Matrix Output
- **Matrix - Crosspoint** Query / Change Matrix Crosspoint Gain
- **Matrix - Reset** Reset Matrix to defaults

- **Scene - Count** Query Scene Count
- **Scene - List** Query Scene Name List
- **Scene - Active** Query Active Scene
- **Scene - Recall** Recall Scene. Accepts variables
- **Scene - Save** Save Scene. Accepts variables
- **Scene - Save New** Save New Scene. Accepts variables
- **Scene - Rename** Rename Scene. Accepts variables
- **Scene - Delete** Delete. Accepts variables
- **Scene - Recall Defaults** Restore Factory Defaults. Does not change network settings

- **System - Subscribe Unsolicited** Query / Change send unsolicited updates
- **System - Link Group** Query / Change link group
- **System - Clock Source** Query / Change clock Source
- **System - Channel Count** Query / Change channel count (8 > 64)
- **System - Automix Channel Offset** Query / change input channel mapped to Automix Channel 1
- **System - Blink Mode** Query / change blink mode
- **System - Headroom** Query the state of the headroom switch on the rear panel
- **System - Sample Rate** Query system sample rate. 48k/96k
- **System - System Configuration** Query System Configuration
- **System - Versions** Query Firmware Versions
- **System - Master** Query Master / Slave state
- **System - Connections** Query active client connections, UDP & TCP
- **System - Resource Usage** Query System Resource Useage
- **System - IP** Query / Change IP address
- **System - DHCP** Query / Change DHCP 
- **System - Netmask** Query / Change Subnet Mask
- **System - Gateway** Query / Change Gateway
- **System - Name** Query / change unit name. Accepts variables

## Version History

### Version 0.1.0
- W.I.P.