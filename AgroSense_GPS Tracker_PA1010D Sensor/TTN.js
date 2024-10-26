function decodeUplink(input) {

    var num = input.bytes[0] * 256 + input.bytes[1];
    var batteryLevel = input.bytes[2] / 10.0;
    var gSensorState = input.bytes[3];
    var gpsStatus = input.bytes[4];
    var gsensor_onoff = input.bytes[22];
    var gsensor_sensitivity = input.bytes[23];
    
    if (gpsStatus != 0) {
        var year = input.bytes[5] * 256 + input.bytes[6];
        var month = input.bytes[7];
        var date = input.bytes[8];
        var hour = input.bytes[9];
        var minute = input.bytes[10];
        var second = input.bytes[11];

        var latitude = (input.bytes[12] * 16777216 + input.bytes[13] * 65536 + input.bytes[14] * 256 + input.bytes[15]) / 100000;
        var nsHemi = input.bytes[16] === 0 ? 'N' : 'S';

        var longitude = (input.bytes[17] * 16777216 + input.bytes[18] * 65536 + input.bytes[19] * 256 + input.bytes[20]) / 100000;
        var ewHemi = input.bytes[21] === 0 ? 'E' : 'W';
    } else {
        var year = 0;
        var month = 0;
        var date = 0;
        var hour = 0;
        var minute = 0;
        var second = 0;

        var latitude = 0;
        var nsHemi = 'N';

        var longitude = 0;
        var ewHemi = 'E';
    }

    // Correct hemisphere values based on actual GPS data
    nsHemi = latitude < 0 ? 'S' : 'N';
    ewHemi = longitude < 0 ? 'W' : 'E';

    // Convert latitude and longitude to positive values if necessary
    latitude = Math.abs(latitude);
    longitude = Math.abs(longitude);

    return {
        data: {
 
            field1: batteryLevel,
            field2: latitude,
            field3: longitude,
            field4: gSensorState,
        },
    };
}