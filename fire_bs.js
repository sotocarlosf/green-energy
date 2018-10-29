var admin = require('firebase-admin');
var serviceAccount = require('./green-energy-4334a-firebase-adminsdk-svgj4-1016778b5e.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://green-energy-4334a.firebaseio.com'
});

//Get a database reference to DB
var db = admin.database();
var ref = db.ref("anaquel/bs");


var moment = require('moment');

// For todays date;
Date.prototype.today = function() {
        return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
    }
    // For the time now
Date.prototype.timeNow = function() {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
}

var mqtt = require("mqtt");

var server = "192.168.0.89";
var port = "1883";
var datos = [
    { topic: "anaquel/bs/led", value: "" },
    { topic: "anaquel/bs/vent", value: "" },
    { topic: "anaquel/bs/warmlight", value: "" },
    { topic: "anaquel/bs/riego", value: "" },
    { topic: "anaquel/bs/temperature", value: "" },
    { topic: "anaquel/bs/humidity", value: "" },
    { topic: "anaquel/bs/co2", value: "" },
    { topic: "anaquel/bs/automatic", value: "" },
    { topic: "anaquel/bs/hora/led", value: "" },
    { topic: "anaquel/bs/hora/warmlight", value: "" },
    { topic: "anaquel/bs/lux", value: "" }
];

let timer_par = {
    fs: {
        led: {
            start_hour: 11,
            start_minute: 53,
            finish_hour: 11,
            finish_minute: 55
        },
        vent: {
            start_hour: 11,
            start_minute: 54,
            finish_hour: 11,
            finish_minute: 56
        },
        warm: {
            start_hour: 11,
            start_minute: 54,
            finish_hour: 11,
            finish_minute: 56
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

var client = mqtt.connect("mqtt://" + server + ":" + port, { keepalive: 60, clean: true, will: null });
client.on("connect", function() { //this library automatically reconnects on errors
    try {
        for (i = 0; i < datos.length; i++) {
            client.subscribe(datos[i].topic, { qos: 2, retain: true }) //chainable API
            console.log(datos[i].topic);
            //if (i <= 3) client.publish(datos[i].topic, 'off');
        }
        client.publish("anaquel/bs/automatic", 'on');
    } catch (ex) {
        console.log(ex);
    }
});

client.on('message', function(topic, message) {
    switch (topic) {
        case "anaquel/bs/led":
            datos[0].value = message.toString();
            break;
        case "anaquel/bs/vent":
            datos[1].value = message.toString();
            break;
        case "anaquel/bs/warmlight":
            datos[2].value = message.toString();
            break;
        case "anaquel/bs/riego":
            datos[3].value = message.toString();
            break;
        case "anaquel/bs/temperature":
            datos[4].value = message.toString();
            break;
        case "anaquel/bs/humidity":
            datos[5].value = message.toString();
            break;
        case "anaquel/bs/co2":
            datos[6].value = message.toString();
            break;
        case "anaquel/bs/automatic":
            datos[7].value = message.toString();
            break;
        case "anaquel/bs/hora/led":
            datos[8].value = message.toString();
            write_timer(timer_par.bs.led, datos[8]);
            break;
        case "anaquel/bs/hora/warmlight":
            datos[9].value = message.toString();
            write_timer(timer_par.bs.warm, datos[9]);
            break;
        case "anaquel/bs/lux":
            datos[10].value = message.toString();
            break;
    }
})

function timer(timer, current_hour, current_minute) {
    // if (((timer.start_hour <= current_hour) && (timer.start_minute <= current_minute)) &&
    //     ((timer.finish_hour >= current_hour) && (timer.finish_minute > current_minute)))

    if ((timer.start_hour <= current_hour) && (timer.finish_hour >= current_hour)) {
        if ((timer.start_hour == current_hour) && (timer.finish_hour == current_hour))
            if ((timer.start_minute <= current_minute) && (timer.finish_minute > current_minute)) return true;
            else return false;
        else if (timer.start_hour == current_hour)
            if (timer.start_minute <= current_minute) return true;
            else return false
        else if (timer.finish_hour == current_hour)
            if (timer.finish_minute > current_minute) return true;
            else return false;
        else return true;
    }
    return false;
}

function write_timer(timer, datos) {
    try {
        timer.start_hour = parseInt(datos.value.substring(0, 2));
        timer.start_minute = parseInt(datos.value.substring(3, 5));
        timer.finish_hour = parseInt(datos.value.substring(6, 8));
        timer.finish_minute = parseInt(datos.value.substring(9));
        if ((timer.start_hour > 23) || (timer.start_minute > 59) || (timer.finish_hour > 23) || (timer.finish_minute > 59) ||
            isNaN(timer.start_hour) || isNaN(timer.start_minute) || isNaN(timer.finish_hour) || isNaN(timer.finish_minute)) throw "Hora fuera de rango";
    } catch (err) {
        console.log("Error en timer");
        timer = {
            start_hour: 12,
            start_minute: 00,
            finish_hour: 20,
            finish_minute: 00

        }
    }
}

function control(timer_js) {
    //console.log(moment().format());
    //console.log(timer_par.fs.led);
    if (timer(timer_js.led, moment().hours(), moment().minutes()) && (datos[0].value != 'off')) {
        client.publish(datos[0].topic, 'off');
    } else {
        if (!timer(timer_js.led, moment().hours(), moment().minutes()) && (datos[0].value == 'off')) {
            client.publish(datos[0].topic, 'on'); //console.log("led")
        }
    }

    if (timer(timer_js.warm, moment().hours(), moment().minutes())) {
        if ((datos[4].value >= 24) && (datos[2].value == 'off')) client.publish(datos[2].topic, 'on');
        else if ((datos[4].value <= 22) && (datos[2].value != 'off')) client.publish(datos[2].topic, 'off');
    } else if (datos[2].value == 'off') client.publish(datos[2].topic, 'on');

    // VENT
    if ((datos[4].value >= 26) && (datos[1].value != 'off')) client.publish(datos[1].topic, 'off');
    if ((datos[4].value <= 22) && (datos[1].value != 'on')) client.publish(datos[1].topic, 'on');

}


let min = moment().minutes();

function read() {
    var newDate = new Date();
    //console.log(timer_fs_led);
    //console.log(timer_fs_warmlight);
    if (datos[7].value == "on") {
        control(timer_par.bs);
    }



    if (newDate.getMinutes() == min) {
        //console.log(newDate.getMinutes());
        min = moment().add(2, 'minutes').minutes();
        var datetime = newDate.today() + " @ " + newDate.timeNow();
        //console.log(`${datetime} : `, datos);
        //console.log(newDate.getMinutes());
        ref.push().set({
            datos: {
                Temperature: datos[4].value,
                Humidity: datos[5].value,
                CO2: datos[6].value,
                Automatic: datos[7].value,
                Lux: datos[10].value
            },
            datetime: {
                Time: moment().format("h:mm:ss"),
                Date: moment().format("dddd, MMMM Do YYYY")
            }
        });
    }

}

let timerId = setInterval(() => read(), 1000);