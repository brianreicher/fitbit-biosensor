//exercise viewd script

import document from 'document';
import exercise from 'exercise';
import * as config from '../config';
import Cycle from '../lib/cycle';
import {Application, View, $at} from '../lib/view';
import * as utils from '../lib/utils';
import Clock from '../subviews/clock';
import GPS from '../subviews/gps';
import HRM from '../subviews/hrm';
import Popup from '../subviews/popup';

//set view grabber tag from GUI/view file
const $ = $at('#view-exercise');

export class ViewExercise extends View{
  // piped from $at()
  el = $();
  
  // grab and init buttons/labels for exercise view metrics
  btnFinish = $("#btnFinish");
  btnToggle = $("#btnToggle");
  lblStatus = $("#lblStatus");

  elBoxStats = $("#boxStats");
  lblSpeed = $("#lblSpeed");
  lblSpeedUnits = $("#lblSpeedUnits");
  lblSpeedAvg = $("#lblSpeedAvg");
  lblSpeedAvgUnits = $("#lblSpeedAvgUnits");
  lblSpeedMax = $("#lblSpeedMax");
  lblSpeedMaxUnits = $("#lblSpeedMaxUnits");
  lblDistance = $("#lblDistance");
  lblDistanceUnits = $("#lblDistanceUnits");
  lblActiveTime = $("#lblActiveTime");
  lblCalories = $("#lblCalories");
  
  //handler to remove popup
  handlePopupNo = () => {
    //remove popup, stop exercise, switch to End exerise view
    this.remove(this.popup);
  };
  
  // handler to accept popup
  handlePopupYes = () => {
    this.remove(this.popup);
    exercise.stop();
    Application.switchTo('ViewEnd');    
  };
  
  // toggle handler
  handleToggle = () => {
    if(exercise.stats === 'started'){
      this.handlePause();
    }
    else{
      this.handleResume();
    }
  };

  // pause handler
  handlePause = () => {
    exercise.pause();
    // set status label to paused
    this.lblStatus.text = 'paused';
    // Show combo PLAY icon 
    this.setComboIcon(this.btnToggle, config.icons.play);
    // show finish button
    utils.show(this.btnFinish);
  }
  
  
  handleResume = () => {
    exercise.resume();
    //set status label to ''
    this.lblStatus.text = '';
    // set icon to the play, show PAUSE icon
    this.setComboIcon(this.btnToggle, config.icons.play);
    // hide finish button
    utils.hide(this.btnFinish);
  }
  
  // helper func to set combo icon
  setComboIcon(combo, icon){
    combo.getElemenById('combo-button-icon').href = icon;
    combo.getElementById('combo-button-icon-press').href = icon;
  }

  // helper to show popup settings upon finishing view
  handleFinish = () => {
    let popupSettings: object {
      title: 'End activity?',
      message: `Are you sure you want to finish this ${config.exerise} session?`,
      btnLeftLabel: 'Cancel',
      // set left button callback function, disregard popup
      btnLeftCallBack: this.handlePopupNo,
      btnRightLabel: 'End',
      // set right button callback function, accept popup
      btnRightCallBack: this.handlePopupYes
    };
    // set popup with previously listed settings
    this.popup = new Popup('#popup', popupSettings);
    // throw popup to the view
    this.insert(this.popup);
  };

  // cancle handler
  handleCancel = () => {
    this.gps.callback = undefined;
    // switch to view selector
    Application.switchTo('ViewSelect');
  }
  
  // Re-render upon refresh
  handleRefresh = () => {
    this.render();
  }
  
  // button handler
  handleButton = (evt) =>{
    // prevent refresh upon button click
    evt.preventDefault();
    switch(evt.key){
      case 'back':
        //handle stopped case for exercise
        if(exercise.state ==='stopped'){
          this.handleCancel();
        }
        else{
          this.cycle.next();
        }
        break;
      case 'up':
        if(exercise.state === 'started'){
          this.handleToggle();
        }
        break;
    }
  }
  
  //handle mount exercise views, reference utils for hiding/showing/inserting
  onMount(): Void{
    utils.hide(this.btnFinish);
    utils.hide(this.btnToggle);
    //set combo icon
    this.setComboIcon(this.btnToggle, config.icons.pause);
    //set status label tex while mounting
    this.lblStatus.text = 'connecting';
    
    // set new objects and insert into subviews
    
    this.clock = new Clock('#subview-clock', 'seconds', this.handleRefresh);
    this.insert(this.clock);
    
    
    this.hrm = new HRM('#subview-hrm');
    this.insert(this.hrm);
    
    this.gps = new GPS('#subview-gps2', this.handleLocationSuccess);
    this.insert(this.gps);
    
    this.cycle = new Cycle(this.elBoxStatus);
    
    // add events to toggle and finish buttons, add event listeners to document
    this.btnToggle.addEventListener('click', this.handleToggle);
    this.btnFinish.addEventListener('click', this.handleFinish);
    document.addEventListener('keypress', this.handleButton);
  }

  onRender(): Void{
    // check elements exist, and set labels to fetched & formatted exercise biometric values
    if(exercise && exercise.stats){
      const speed = utils.formatSpeed(exercise.stats.speed.current);
      this.lblSpeed.text = speed.value;
      this.lblSpeedUnits.text = `speed ${speed.units}`;

      const speedAvg = utils.formatSpeed(exercise.stats.speed.average);
      this.lblSpeedAvg.text = speedAvg.value;
      this.lblSpeedAvgUnits.text = `speed avg ${speedAvg.units}`;

      const speedMax = utils.formatSpeed(exercise.stats.speed.max);
      this.lblSpeedMax.text = speedMax.value;
      this.lblSpeedMaxUnits.text = `speed max ${speedMax.units}`;

      const distance = utils.formatDistance(exercise.stats.distance);
      this.lblDistance.text = distance.value;
      this.lblDistanceUnits.text = `distance ${distance.units}`;
      
      this.lblActiveTime.text = utils.formatActiveTime(exercise.stats.activeTime);
      this.lblCalories.text = utils.formatCalories(exercise.stats.calories);
    }
  }
  
  onUnmount(): Void{
    this.cycle.removeEvents();
    this.btnToggle.removeEventListener('click', this.handleToggle);
    this.btnFinish.removeEventListener('click', this.handleFinish);
    document.removeEventListener('keypress', this.handleButton);
  }
}