function decodeUplink(input) {
    
    // Optionally define max and min values for ADC
    // Un-comment the variable value and change to suit your needs
    var adcMax; //= 1500; // adcMax is "dry" soil
    var adcMin; //= 1200; // adcMin is "wet" soil

    // User defined number of decimal places as a variable
    var decimalPlaces = 2;

    // Variables calculated from device payload
    // var num = input.bytes[0] * 256 + input.bytes[1]
    var Battery = (input.bytes[4] / 10.0).toFixed(decimalPlaces) + "V";
    var ADC = input.bytes[2] * 256 + input.bytes[3];
    
    // Prepare the data object
    var data = {
        Battery: Battery,
        ADC: ADC
    };

    // Only calculate and add Moisture if adcMax and adcMin are defined
    if (adcMax !== undefined && adcMin !== undefined) {
        var Moisture = ((Math.max(0, Math.min(100, ((adcMax - ADC) / (adcMax - adcMin)) * 100)))
                        .toFixed(decimalPlaces) + "%");
        data.Moisture = Moisture;
    }

    return { data: data };
}
