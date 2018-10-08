var moment = require('moment');
console.log(moment().format());

let minutes = 0;

function read() {
    minutes = moment().minutes();
    console.log(minutes);
    if ((minutes > 42) && (minutes < 46)) {
        console.log("hola");
    }


}
//var led = a.duration(2, 'h');
//var b = a("2013-02-08T09:00:00").add(2, 'hours');
//var c = a("2013-02-08T15:00:00");
//var int = (moment.duration(b.diff(c)));
//console.log(b.isAfter("00:00"));
//console.log((5 < b.hours()) && (b.hours() < 12));
//console.log(b.diff(led));
//console.log(c.format());


//console.log(b.diff(c, 'hours'));7
timer_par = {
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

var datos = {
    fs: {
        led: { "topic": "anaquel/fs/led", "value": "fr" },
        vent: { topic: "anaquel/fs/vent", value: "" }
    }
}

function timer(timer, current_hour, current_minute) {
    if (((timer.start_hour <= current_hour) && (timer.start_minute <= current_minute)) &&
        ((timer.finish_hour >= current_hour) && (timer.finish_minute > current_minute)))
        return true;
    else return false;
}

// function timer(start_hour, start_minute, finish_hour, finish_minute, current_hour, current_minute) {
//     if (((start_hour <= current_hour) && (start_minute <= current_minute)) &&
//         ((finish_hour >= current_hour) && (finish_minute > current_minute)))
//         return true;
//     else return false;
// }
let timerId = setInterval(function() {
    //console.log(moment().minutes());
    // console.log(moment().hours());
    // console.log(timer(0, 43, 0, 47, moment().hours(), moment().minutes()));
    console.log(moment().format("dddd, MMMM Do YYYY"));
    if (timer(timer_par.fs.led, moment().hours(), moment().minutes())) console.log("led")
    if (timer(timer_par.fs.vent, moment().hours(), moment().minutes())) console.log("vent")
    if (timer(timer_par.fs.warm, moment().hours(), moment().minutes())) console.log("warm")
}, 1000);
console.log(datos.fs.led);