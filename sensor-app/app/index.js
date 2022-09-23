import clock from "clock";
import {battery, charger} from "power";
import {HeartRateSensor} from "heart-rate";
import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "seconds";

// Get a handle on the <text> element
const timeLabel = document.getElementById("timeLabel");
const heartRateHandle = document.getElementByID("heartRateLabel");
const batteryHandle = document.getElementByID("batteryLabel");
const chargeHandle = document.getElementByID("chargeLabel")


// Heart rate sensor
const hrm = new HeartRateSensor();
hrm.onreading = () => {
  heartRateHandle.text = '${hrm.heartRate}';
}
hrm.start();

// Battery sensor
let batteryValue = battery.chargeLevel;
batteryHandle.text = "Battery Level: ${batteryValue} %"

// Charging sensor
let chargeState = battery.charging;
let chargeDesc;
battery.onchange = () => {
  batter
}

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  myLabel.text = `${hours}:${mins}`;
}

