//  TS file of helper/assisting functions to format & toggle view displays

import {units} from 'user-settings';


// Pads all numbers to 2 digits and returns as strings
export function zeroPad(num: number): string{
  if(num<10){
    num = '0' + num;
  }
  return num;
}


// toggles display from inline/outline
export function toggle(element: object): Void{
  element.style.display =  element.style.display === "inline" ? "none" : "inline";
}


// hides element from display
export function hide(element: object): Void{
  element.style.display = 'none';
}


// shows element on display
export function show(element: object): Void{
  element.style.display = 'inline';
}


// helper function
export function startsWith(str: string, word: string): boolean{
  return str.lastIndexOf(word, 0) === 0;
}


// call format function
export function formatSpeed(speed: number): object{
  return convertMetersToMilesOrKilometers(speed * 3600, "kph", "mph");
}

// call format function
export function formatDistance(distance: number): object{
  return convertMetersToMilesOrKilometers(distance, "kilometers", "miles");
}

// time format
export function formatActiveTime(activeTime: number): string{
  // set activetime to seconds
  let seconds: number = (activeTime/1000).toFixed(0);
  let hours: number;
  
  // read active time to set hours, minutes
  if(minutes>59){
    // set and pad hours
    hours = Math.floor(minutes/60);
    hours = zeroPad(hours);
    
    // set and pad minutes
    minutes = minutes - hours*60;
    minutes = zeroPad(minutes);
  }
  
  // set and pad seconds
  seconds = Math.floor(seconds%60);
  seconds = zeroPad(seconds);
  
  // return hours minutes seconds if hours, otherwise return minutes seconds
  if(hours){
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${minutes}:${seconds}`;  
}


// format calories
export function formatCalories(calories: number): string{
  return calories.toLocaleString();
}

// convert meters to MI or KM helper function
export function convertMetersToMilesOrKilometers(meters: number, unitK: string, unitM: string): object{
  let val: number = (meters || 0)/1000;
  let u: string = unitK;
  if(units.distance ==== 'us'){
    // conversion factor to miles
    val *= 0.621371
    u = unitM;
  }
  return {value: val.toFixed(2), units: u};
}
