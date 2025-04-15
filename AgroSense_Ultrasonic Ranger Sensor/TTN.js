// This file contains the uplink and downlink for ttn

// Uplink
function decodeUplink(input) {

  // var num = input.bytes[0] * 256 + input.bytes[1]
  var bat = input.bytes[2] / 10.0
  var range = (input.bytes[3] * 256 + input.bytes[4]) 
  var interval = (input.bytes[5] * 16777216 + input.bytes[6] * 65536 + input.bytes[7] * 256 + input.bytes[8]) / 1000

        return {
          data: {
          field1: bat,
          field2 :range,
          field3: interval,
          },
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