var moment = require('moment');

//var admin = require('firebase-admin');
//var serviceAccount = require('./green-energy-4334a-firebase-adminsdk-svgj4-1016778b5e.json');

//admin.initializeApp({
//    credential: admin.credential.cert(serviceAccount),
//    databaseURL: 'https://green-energy-4334a.firebaseio.com'
//});

//Get a database reference to DB
//var db = admin.database();
//var ref = db.ref("anaquel");

let min = 0;
// For todays date;
Date.prototype.today = function() {
        return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
    }
    // For the time now
Date.prototype.timeNow = function() {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
}

var mqtt = require("mqtt");

var server = "192.168.0.26";
var port = "1883";
var datos = {
    fs: {
        led: { topic: "anaquel/fs/led", value: "" },
        vent: { topic: "anaquel/fs/vent", value: "" },
        warmlight: { topic: "anaquel/fs/warmlight", value: "" },
        riego: { topic: "anaquel/fs/riego", value: "" },
        temperature: { topic: "anaquel/fs/temperature", value: "" },
        humidity: { topic: "anaquel/fs/humidity", value: "" },
        co2: { topic: "anaquel/fs/co2", value: "" },
        automatic: { topic: "anaquel/fs/automatic", value: "" }
    },
    rs: {
        led: { topic: "anaquel/rs/led", value: "" },
        vent: { topic: "anaquel/rs/vent", value: "" },
        warmlight: { topic: "anaquel/rs/warmlight", value: "" },
        riego: { topic: "anaquel/rs/riego", value: "" },
        temperature: { topic: "anaquel/rs/temperature", value: "" },
        humidity: { topic: "anaquel/rs/humidity", value: "" },
        co2: { topic: "anaquel/rs/co2", value: "" },
        automatic: { topic: "anaquel/rs/automatic", value: "" }
    }
}

let timer_par = {
    fs: {
        led: {
            start_hour: 10,
            start_minute: 22,
            finish_hour: 10,
            finish_minute: 25
        },
        vent: {
            start_hour: 10,
            start_minute: 22,
            finish_hour: 10,
            finish_minute: 24
        },
        warm: {
            start_hour: 10,
            start_minute: 19,
            finish_hour: 10,
            finish_minute: 22
        }
    },
    rs: {
        led: {
            start_hour: 10,
            start_minute: 22,
            finish_hour: 10,
            finish_minute: 25
        },
        vent: {
            start_hour: 10,
            start_minute: 22,
            finish_hour: 10,
            finish_minute: 24
        },
        warm: {
            start_hour: 10,
            start_minute: 19,
            finish_hour: 10,
            finish_minute: 22
        }
    },
    ws: {
        led: {
            start_hour: 10,
            start_minute: 22,
            finish_hour: 10,
            finish_minute: 25
        },
        vent: {
            start_hour: 10,
            start_minute: 22,
            finish_hour: 10,
            finish_minute: 24
        },
        warm: {
            start_hour: 10,
            start_minute: 19,
            finish_hour: 10,
            finish_minute: 22
        }
    },
    bs: {
        led: {
            start_hour: 10,
            start_minute: 22,
            finish_hour: 10,
            finish_minute: 25
        },
        vent: {
            start_hour: 10,
            start_minute: 22,
            finish_hour: 10,
            finish_minute: 24
        },
        warm: {
            start_hour: 10,
            start_minute: 19,
            finish_hour: 10,
            finish_minute: 22
        }
    }
}

let automatic = true;

var client = mqtt.connect("mqtt://" + server + ":" + port, { keepalive: 60, clean: true, will: null });
client.on("connect", function() { //this library automatically reconnects on errors
    try {
        client.subscribe('#', mqtt_subscribe) //chainable API

        client.publish("anaquel/fs/automatic", 'on');
    } catch (ex) {
        console.log(ex);
    }
});

function mqtt_subscribe(err, granted) {
    console.log("Subscribed to " + Topic);
    if (err) { console.log(err); }
}

let hora = 0;

client.on('message', function(topic, message) {
    switch (topic) {
        case "anaquel/fs/led":
            datos.fs.led.value = message.toString();
            break;
        case "anaquel/fs/vent":
            datos.fs.vent.value = message.toString();
            break;
        case "anaquel/fs/warmlight":
            datos.fs.warmlight.value = message.toString();
            break;
        case "anaquel/fs/riego":
            datos.fs.riego.value = message.toString();
            break;
        case "anaquel/fs/temperature":
            datos.fs.temperature.value = message.toString();
            break;
        case "anaquel/fs/humidity":
            datos.fs.humidity.value = message.toString();
            break;
        case "anaquel/fs/co2":
            datos.fs.co2.value = message.toString();
            break;
        case "anaquel/fs/automatic":
            datos.fs.automatic.value = message.toString();
            break;
        case "anaquel/fs/hora/led":
            hora = message.toString();
            try {
                timer_par = parseInt(hora.substring(0, 2));
                hora[1] = parseInt(hora.substring(3, 5));
                hora[2] = parseInt(hora.substring(6, 8));
                hora[3] = parseInt(hora.substring(9));
                if ((timer_fs_led[0] > 23) || (timer_fs_led[1] > 59) || (timer_fs_led[2] > 23) || (timer_fs_led[3] > 59) ||
                    isNaN(timer_fs_led[0]) || isNaN(timer_fs_led[1]) || isNaN(timer_fs_led[2]) || isNaN(timer_fs_led[3])) throw "Hora fuera de rango";
            } catch (err) {
                console.log("Error en timer");
                timer_fs_led = [7, 0, 12, 0];
            }
            break;
        case "anaquel/fs/hora/warmlight":
            datos[9].value = message.toString();
            try {
                timer_fs_warmlight[0] = parseInt(datos[9].value.substring(0, 2));
                timer_fs_warmlight[1] = parseInt(datos[9].value.substring(3, 5));
                timer_fs_warmlight[2] = parseInt(datos[9].value.substring(6, 8));
                timer_fs_warmlight[3] = parseInt(datos[9].value.substring(9));
                if ((timer_fs_warmlight[0] > 23) || (timer_fs_warmlight[1] > 59) || (timer_fs_warmlight[2] > 23) || (timer_fs_warmlight[3] > 59) ||
                    isNaN(timer_fs_warmlight[0]) || isNaN(timer_fs_warmlight[1]) || isNaN(timer_fs_warmlight[2]) || isNaN(timer_fs_warmlight[3])) throw "Hora fuera de rango";
            } catch (err) {
                console.log("Error en timer");
                timer_fs_warmlight = [12, 0, 20, 0];
            }
            break;
    }
})


function read() {
    var newDate = new Date();
    //console.log(timer_fs_led);
    //console.log(timer_fs_warmlight);
    if (datos[7].value == "on") {
        automatic = true;
        // console.log("automatic");
    } else automatic = false;

    if (automatic) {
        if ((newDate.getHours() >= timer_fs_led[0]) &&
            (newDate.getHours() <= timer_fs_led[1])) { //LEDS

            client.publish(datos[0].topic, 'off');
        } else client.publish(datos[0].topic, 'on');

        if ((newDate.getHours() >= timer_fs_warmlight[0]) &&
            (newDate.getHours() <= timer_fs_warmlight[1])) { //LEDS

            client.publish(datos[2].topic, 'off');
        } else client.publish(datos[2].topic, 'on');


        if ((datos[4].value >= 25)) client.publish(datos[1].topic, 'off');
        if ((datos[4].value <= 20)) client.publish(datos[1].topic, 'on');
    }

    if (newDate.getMinutes() != min) {
        min = newDate.getMinutes();
        var datetime = newDate.today() + " @ " + newDate.timeNow();
        console.log(`${datetime} : `, datos);
        console.log(newDate.getMinutes());
        //if (datetime.isAfter("21/08/2018 @ 17:15:00")) client.publish(datos[0].topic, 'on');
        // ref.push().set({
        //     datos: {
        //         Leds: datos[0].value,
        //         Ventilador: datos[1].value,
        //         Warmlight: datos[2].value,
        //         Riego: datos[3].value,
        //         Temperature: datos[4].value,
        //         Humidity: datos[5].value,
        //         CO2: datos[6].value,
        //         Automatic: datos[7].value
        //     },
        //     datetime
        // });
    }

}

let timerId = setInterval(() => read(), 1000);