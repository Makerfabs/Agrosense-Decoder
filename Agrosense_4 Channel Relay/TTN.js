// This file contains the uplink and downlink for ttn

// Uplink

function decodeUplink(input) {
  var bytes = input.bytes;

  var num = bytes[0] * 256 + bytes[1];
  var Relay_1 = bytes[2];
  var Relay_2 = bytes[3];
  var Relay_3 = bytes[4];
  var Relay_4 = bytes[5];
  var humidity = (bytes[6] * 256 + bytes[7]) / 10.0;
  
  var temperature = bytes[8] * 256 + bytes[9];
  if (temperature >= 0x8000) {
    temperature -= 0x10000;
  }
  temperature = temperature / 10.0;

  var INA_1 = (bytes[10] * 256 + bytes[11]) / 10.0;
  var INA_2 = (bytes[12] * 256 + bytes[13]) / 10.0;
  var interval = (
    bytes[18] * 16777216 +
    bytes[19] * 65536 +
    bytes[20] * 256 +
    bytes[21]
  ) / 1000;

  return {
    data: {
      Relay_1: Relay_1,//RELAY1   :0-OFF; 1-ON
      Relay_2: Relay_2,//RELAY2   :0-OFF; 1-ON
      Relay_3: Relay_3,//RELAY3   :0-OFF; 1-ON
      Relay_4: Relay_4,//RELAY4   :0-OFF; 1-ON
      INA_1: INA_1,//0-5V ADC
      INA_2: INA_2,//0-5V ADC
      temperature: temperature,
      humidity: humidity,
      interval: interval
    },
    warnings: [],
    errors: []
  };
}
// .................................................................................................
// .................................................................................................
// .................................................................................................
// Downlink.........................................................................................
// .................................................................................................
// .................................................................................................
// .................................................................................................

// Encoder function to be used in the TTN console for downlink payload
// fPort 6   RELAY1   : 0-OFF; 1-ON
// fPort 7   RELAY2   : 0-OFF; 1-ON
// fPort 8   RELAY3   : 0-OFF; 1-ON
// fPort 9   RELAY4   : 0-OFF; 1-ON

function encodeDownlink(input) {
  // Get the relay status from user input; the relay is identified by the fPort
  var relayStatus = input.RELAY;  // User input: 0 or 1
  var fPort = input.fPort;        // Get fPort (6, 7, 8, or 9)

  // Ensure that relayStatus only accepts 0 or 1
  relayStatus = relayStatus === 1 ? 1 : 0;

  // Determine the relay state based on fPort
  var payload = [relayStatus];

  // Return the downlink message in the format required by TTN
  return {
    bytes: payload,  // Byte array to send
    fPort: fPort,    // Dynamically set fPort
    warnings: [],
    errors: []
  };
}