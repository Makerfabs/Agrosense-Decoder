
// This file contains the uplink and downlink for datacake

// Uplink

function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    var bat = input.bytes[2] / 10.0
    var range = (input.bytes[3] * 256 + input.bytes[4]) 
    var interval = (input.bytes[5] * 16777216 + input.bytes[6] * 65536 + input.bytes[7] * 256 + input.bytes[8]) / 1000
  
    var decoded = 
    {
      bat:bat,
      range:range,
	    interval:interval,
    };

    // Test for LoRa properties in normalizedPayload
 try {

  if (normalizedPayload.gateways && normalizedPayload.gateways.length > 0) {
    decoded.lora_rssi = normalizedPayload.gateways[0].rssi || 0;
    decoded.lora_snr = normalizedPayload.gateways[0].snr || 0;
  } else {
    decoded.lora_rssi = 0;
    decoded.lora_snr = 0;
  }


  decoded.lora_datarate = normalizedPayload.spreading_factor 
                       || normalizedPayload.data_rate 
                       || (normalizedPayload.networks && normalizedPayload.networks.lora && normalizedPayload.networks.lora.dr)
                       || "unknown";
  
} catch (error) {
  console.log('LoRa property parsing error:', error);
  decoded.lora_rssi = 0;
  decoded.lora_snr = 0;
  decoded.lora_datarate = "unknown";
}

return [
  { field: "bat", value: decoded.bat },
  { field: "range", value: decoded.range },
  { field: "interval", value: decoded.interval },
  { field: "lora_rssi", value: decoded.lora_rssi },
  { field: "lora_snr", value: decoded.lora_snr },
  { field: "lora_datarate", value: decoded.lora_datarate },
];
}


// .................................................................................................
// .................................................................................................
// .................................................................................................
// Downlink.........................................................................................
// .................................................................................................
// .................................................................................................
// .................................................................................................

// Encoder function for port 1
/**
 * String.prototype.repeat() polyfill
 */
if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
      if (this == null) throw new TypeError("can't convert " + this + " to object");
      var str = '' + this;
      count = +count;
      if (count < 0 || count === Infinity) throw new RangeError("repeat count must be non-negative and finite");
      if (count === 0) return '';
      var result = '';
      while (count-- > 0) {
          result += str;
      }
      return result;
  };
}

/**
* String.prototype.padStart() polyfill
*/
if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength, padString) {
      targetLength = targetLength >> 0;
      padString = String(padString || ' ');
      if (this.length >= targetLength) {
          return String(this);
      } else {
          targetLength = targetLength - this.length;
          if (targetLength > padString.length) {
              padString += padString.repeat(targetLength / padString.length);
          }
          return padString.slice(0, targetLength) + String(this);
      }
  };
}

function Encoder(measurements, port) {
  var interval = measurements["SENDING_TIME_INTERVAL"].value * 60;

  return interval
      .toString(16)
      .padStart(8, '0')
      .match(/.{2}/g)
      .map(function(f) {
          return parseInt(f, 16);
      });
}
