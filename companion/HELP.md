## Dan Dugan Sound Design Model Automixer

This module will control the Model M or N automixer. There are 64 Madi or Dante inputs & outputs, and 16 adat inputs and outputs.
Most functions will work with the Dugan-MY16 .

- [Dugan Auto Mixer Product Page](https://www.dandugan.com/products/)

## Configuration
Enter the IP address of the control port of the Automixer. The unit will accept connections on TCP:23 or TCP:9776 (and UDP:9776, not supported here). This model defaults to TCP:23 for easiest integration with firewalls and complex networks. Keep alive will poll system parameters at the set interval. Enter the number of automix channels the unit is configured as for correcct initialisation.

## Actions
- **Channel - Bypass** Query / Change Channel Bypass
- **Channel - Group Assignment** Query / Change Channel Group Assignment
- **Channel - Mode** Query / Change Channel Mode: Manual, Auto, Mute
- **Channel - Music** Query / Change Channel Music Mode
- **Channel - Name** Query / Change Channel Name - up to 15 characters.  Accepts variables
- **Channel - NOM Mode** Query / Change Channel NOM Mode
- **Channel - Override** Query / Change Channel Override
- **Channel - Preset** Query / Change Channel Preset: Manual, Auto, Mute
- **Channel - Weight** Query / Change Channel Weight. Float from -100.00 dB to +20.00 dB

- **Group - Automix Depth** Query / Change Group Automix Depth
- **Group - Last Hold** Query / Change Group Last Hold
- **Group - Music System Threshold** Query / Change Group Music System Threshold
- **Group - Music System Threshold Input** Query / Change Group Music System Threshold Input
- **Group - Mute** Query / Change Group Mute
- **Group - NOM Gain Limit** Query / Change Group Gain Limit
- **Group - Over ride** Query / Change Group Over ride
- **Group - Preset** Query / Change Group Preset

- **Matrix - Bus Mute** Query / Change Matrix Mute
- **Matrix - Bus Polarity** Query / Change Matrix Polarity
- **Matrix - Crosspoint** Query / Change Matrix Crosspoint Gain
- **Matrix - Gain** Query / Change Matrix Output Gain
- **Matrix - Output** Query / Change Matrix Output

- **Metering** Query various metering and channel flags. Return data not handled yet.

- **Query - Bulk Config** Query all channel params or matrix crosspoints
- **Query - Name List** Query Channel or Scene Name List
- **Query - System** Query readonly system parameters and write to log

- **Recall Defaults** Reset channels or matrix to defaults

- **Scene - Active** Query Active Scene
- **Scene - Count** Query Scene Count
- **Scene - Delete** Delete. Accepts variables
- **Scene - Recall** Recall Scene. Accepts variables
- **Scene - Rename** Rename Scene. Accepts variables
- **Scene - Save** Save Scene. Accepts variables
- **Scene - Save New** Save New Scene. Accepts variables

- **System - Adat Mirror** Query / Change channel count echod to Adat
- **System - Automix Channel Offset** Query / change input channel mapped to Automix Channel 1
- **System - Automix Channels** Query / Change channel count (8 > 64)
- **System - Blink Mode** Query / change blink mode
- **System - Clock Source** Query / Change clock Source
- **System - Link Group** Query / Change link group
- **System - Clock Source** Query / Change clock Source
- **System - Name** Query / change unit name. Accepts variables
- **System - Network** Query / Change IP, Subnet or Gateway address
- **System - Network DHCP** Query / Change DHCP 
- **System - Name** Query / change unit name. Accepts variables
- **System - Subscribe Unsoliccited** Query / change unsolicited messages

## Support for other models
At present only the Model M & N are explicitly supported. With that said, the dugan units share a common api.
The Model M & N represent thr complete set of API commands. All other units (MY-16, Model-E3A, etc) support a subset of of these commands. The core channel controls are supported by all units.
Until such time as the other models are directly supported, set the the channel count to the appropriate value, and dont use the functions not supported by your unit. Bulk state reporting varies between units,so stateful commands rather than explit commands may be problematic.

## Version History

### Version 0.1.0
- W.I.P.