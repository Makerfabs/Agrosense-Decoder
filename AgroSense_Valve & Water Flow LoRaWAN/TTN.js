// This file contains the uplink and downlink for ttn

// Uplink

function decodeUplink(input) {
  var bytes = input.bytes;

  var num = bytes[0] * 256 + bytes[1];
  var bat = input.bytes[2]/10;
  var Valve = input.bytes[3]; //Valve state   :0--OFF; 1--ON
  var flow_pulse_1s_diff = input.bytes[4] * 256 + input.bytes[5]; //Pulse changes within 1 second
  var flow_velocity = flow_pulse_1s_diff*60/450;  // L/min
  var flow_rate = flow_pulse_1s_diff/450; //L
  var Valve_on_all_time =  input.bytes[6]* 16777216 + input.bytes[7]* 65536 + input.bytes[8] * 256 + input.bytes[9]; //Time from opening to closing of the latest valve
  var interval = (input.bytes[10]* 16777216 + input.bytes[11]* 65536 + input.bytes[12] * 256 + input.bytes[13]) / 1000; //interval when valve is open


  return {
    data: {
      field1: num,
      field2: bat,
      field3: Valve,
      field4: flow_velocity,
      field5: flow_rate,
      field6: Valve_on_all_time,
      field7: interval,
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

// fPort 1   modification interval
// Encoder function for port 1
function Encoder(input) {
    var minutes = input.minutes;

    // Converting minutes to seconds
    var seconds = minutes * 60;

    // If the number of seconds is less than 300 seconds, set it to 300 seconds
    if (seconds < 300) {
        seconds = 300;
    }

    var payload = [
        (seconds >> 24) & 0xFF,
        (seconds >> 16) & 0xFF,
        (seconds >> 8) & 0xFF,
        seconds & 0xFF
    ];

    return payload;
}

// fPort 6   Valve control   : 0-OFF; 1-ON
// Encoder function for port 6
function encodeDownlink(input) {
  // Get the valve status from user input; the valve is identified by the fPort
  var valveStatus = input.VALVE;  // User input: 0 or 1
  var fPort = input.fPort;        // Get fPort

  // Ensure that valveStatus only accepts 0 or 1
  valveStatus = valveStatus === 1 ? 1 : 0;

  // Determine the valve state based on fPort
  var payload = [valveStatus];

  // Return the downlink message in the format required by TTN
  return {
    bytes: payload,  // Byte array to send
    fPort: fPort,    // Dynamically set fPort
    warnings: [],
    errors: []
  };
}