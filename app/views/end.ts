// 'end' view script, using utils, subviews to buld up end view

import exercise from 'exercise';
import * as utils from '../lib/utils';
import {View, $at} from '../lib/view';
import Clock from '../subviews/clock';


// set $ constant as the output of $at '#view-end' query in View file
const $ = $at('#view-end');

export class ViewEnd extends View{
  // piped through $at()
  el = $();

  // TODO: ADD MORE BIOMARKERS
  //grab & set label in view file by name 
  lblActiveTime = $('#lblActiveTime');
  lblHeartRateAvg = $('#lblHeartRateAvg');
  lblHeartRateMax = $('#lblHeartRateMax');
  lblSpeedAvg = $('#lblSpeedAvg');
  lblSpeedMax = $('#lblSpeedMax');
  lblDistance = $('lblDistance');
  
  // mount and insert clock, call and set labels for biometric stats
  onMount(): Void{
    this.clock = new Clock('#subview-clock2', 'seconds');
    // throw clock into viewend
    this.insert(this.clock);
    
    //set active time label in view
    // call the active time or set to 0, and format it through the utils file
    this.lblActiveTime.text = `active time: ${utils.formatAciveTime(exercise.stats.activeTime ||0)}`;
    
    // set avg, max heart rate label in view
    // call avg heart rate, no need to format, set to 0 if not available
    this.lblHeartRateAvg.text = `heart rate avg: ${exercise.stats.heartRate.average || 0} bpm`;
    this.labelHeartRateMax.text = `heart rate max: ${exercise.stats.hearRate.max || 0} bpm`;
    
    //set avg, max speed labels
    // format with utils func first
    const speedAvg = utils.formatSpeed(exercise.stats.speed.avergage || 0); // returns value, units
    const speedMax = utils.formatSpeed(exersie.stats.speed.max || 0);
    
    this.lblSpeedAvg.text = `speed avg: ${speedAvg.value} ${speedAvg.units}`;
    this.lblSpeedMax.text - `speed max: ${speedMax.value} ${speedMax.units}`;
    
    //set avg, max speed labels
    // format with utils func first
    const distance = utils.formatDistance(exercise.stats.distance || 0);
    this.lblDistance.text = `distance: ${distance.value} ${distance.units}`;
  }
  
  //init functions, to be filled later
  onRender(){    
  }
  
  onUnmount(){
  }


}