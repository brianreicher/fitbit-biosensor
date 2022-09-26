// clock subview script, basic digital cock build

import clock from 'clock';
import {preferences} from 'user-settings';

import {zeroPad} from '../lib/utils';
import {View, $at} from '../lib/view';

//Clock class, default
export default class Clock extends View{
  constructor(parents, granularity, callback: Function | Any){
    // need to check that parent element is defined
    if(!parent) throw new Error('Clock parent is undefined');\
    const $ = $at(parent);
    this.lblClock = $('#lblClock');
    clock.granularity = granularity || 'seconds';
    this.callback = callback;
    super();
  }
  
  // set mount
  onMount(){
    clock.addEventListener('tick', this.handleTick);
  }
  
  // handle event listener
  handleTick = (evt: object) => {
    // grab time elements from evt object
    const today = evt.date;
    const hours = evt.today.getHours();
    const mins = zeropad(today.getMinutes());
    
    // check user settings for 12-24 hour time
    if(preferences.clockDisplay === '12h'){
      hours = hours%12 || 12
    }
    else{
      hours = zeroPad(hours); // 24h time format
    }
    //set clock text label to current time
    this.lblClock.text = `${hours}${minutes}`;
    // run callback function if exists
    if (typeof this.callback === 'function') this.callback();
  };

  onUnmount(): Void{
    clock.removeEventListener('tick', this.handleTick);
  }
}