
// This file contains the uplink and downlink for datacake

// Uplink

function Decoder(payload, port) {
    var input = {
        bytes: payload
    };

    var num = input.bytes[0] * 256 + input.bytes[1]
    var Relay_1 = input.bytes[2]
    var Relay_2 = input.bytes[3]
    var Relay_3 = input.bytes[4]
    var Relay_4 = input.bytes[5]
    var humidity = ( input.bytes[6] * 256 + input.bytes[7] ) / 10.0
    var temperature = input.bytes[8] * 256 + input.bytes[9]
    if (temperature >= 0x8000) 
	{
       		 temperature -= 0x10000;
   	 }
    temperature = temperature / 10.0
    
    var INA_1 = ( input.bytes[10] * 256 + input.bytes[11] ) / 10.0
    var INA_2 = ( input.bytes[12] *256 + input.bytes[13] ) / 10.0
    
    var interval = (input.bytes[18]* 16777216 + input.bytes[19]* 65536 + input.bytes[20] * 256 + input.bytes[21]) / 1000

    var decoded = 
    {
        Relay_1:Relay_1,
        Relay_2:Relay_2,
        Relay_3:Relay_3,
        Relay_4:Relay_4,
        INA_1:INA_1,
        INA_2:INA_2,
	    temperature:temperature,
	    humidity:humidity,
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
  { field: "Relay_1", value: decoded.Relay_1 },
  { field: "Relay_2", value: decoded.Relay_2 },
  { field: "Relay_3", value: decoded.Relay_3 },
  { field: "Relay_4", value: decoded.Relay_4 },
  { field: "INA_1", value: decoded.INA_1 },
  { field: "INA_2", value: decoded.INA_2 },
  { field: "humidity", value: decoded.humidity },
  { field: "temperature", value: decoded.temperature },
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
// Encoder function to be used in the Datacake console for downlink payload
// fPort 6   RELAY1   : 0-OFF; 1-ON
// fPort 7   RELAY2   : 0-OFF; 1-ON
// fPort 8   RELAY3   : 0-OFF; 1-ON
// fPort 9   RELAY4   : 0-OFF; 1-ON

// Encoder function for port 6 (Relay1 control)
function Encoder(measurements, port) {

    var payload = [];
      
      var relayStatus = measurements["RELAY1_ON_OFF"] ? measurements["RELAY1_ON_OFF"].value : 0;
      
      relayStatus = relayStatus === true ? 1 : 0;
      
      payload.push(relayStatus);
    
      return payload;
}

// Encoder function for port 7 (Relay2 control)
function Encoder(measurements, port) {

    var payload = [];
      
      var relayStatus = measurements["RELAY2_ON_OFF"] ? measurements["RELAY2_ON_OFF"].value : 0;
      
      relayStatus = relayStatus === true ? 1 : 0;
      
      payload.push(relayStatus);
    
      return payload;
}

// Encoder function for port 8 (Relay3 control)
function Encoder(measurements, port) {

    var payload = [];
      
      var relayStatus = measurements["RELAY3_ON_OFF"] ? measurements["RELAY3_ON_OFF"].value : 0;
      
      relayStatus = relayStatus === true ? 1 : 0;
      
      payload.push(relayStatus);
    
      return payload;
}

// Encoder function for port 9 (Relay4 control)
function Encoder(measurements, port) {

    var payload = [];
      
      var relayStatus = measurements["RELAY4_ON_OFF"] ? measurements["RELAY4_ON_OFF"].value : 0;
      
      relayStatus = relayStatus === true ? 1 : 0;
      
      payload.push(relayStatus);
    
      return payload;
}