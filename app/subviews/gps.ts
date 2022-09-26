// gps subview build

import {me} from 'appbit';
import {geolocation} from 'geolocation';
import {View, $at} from '../lib/view';

// default GPS class
export default class GPS extensds View{
  constructor(parent, callback){ //:function
    // check for parent existence 
    const $ = $at(parent);
    this.iconGps = $('#icon-gps');
    this.callback = callback;
    super();
  }
  
  onMount(){
    // check for location access
    if(me.permissions.granted('access_location')){
      this.watch();
    }
    else{
      this.gpsBad();
    }
  }
  
  onUnmount(){
    if(this.watchId){
      geolocation.clearWatch(this.watchId);
      this.watchId = undefined;
    }
  }
  
  watch(): Void{
    this.watchId = geolocation.watchPosition(this.handleSuccess, this.handleError);
  }
  
  // set GPS UI if services are enabled
  gpsGood(): Void{
    if(this.iconGps) this.iconGps.style.fill = 'fb-green';
  }
  
  gpsBad(): Void{
    if(this.iconGps) this.iconGps.style.fill = 'fb-red';
  }
  
  // GPS success handler
  handleSuccess = (position) => {
    // set gps UI to good
    this.gpsGood();
    // run callback function if it exists as a function
    if(typeof this.callback === 'function') this.callback();
  }
  
  // GPS error handler
  handleError = (error) => {
    // Throw console error as a JSON and set UI to bad
    console.error(JSON.stringify(error));
    this.gpsBad();
  }
}
