// 'select' view script

import {me} from 'appbit';
import document from 'document';
import * as config from '../config';
import {Application, View, $at} from '../lib/view';

//set view-select grabber tag from GUI/view file
const $ = $at('#view-select');

export class ViewSelect extends View{
  el = $();
  
  constructor(){
    this.btnStart = $('#btnStart');
    this.lblTitle = $('lblTitle');
    
    super();
  }
  
  // start handler
  handleStart = () => {
    Application.switchTo('ViewExercise');
  }
  
  // keypress handler
  handleKeypress = (evt) => {
    if(evt.key === 'down') this.handleStart();
  }
  
  onMount(){
    me.appTimeoutEnabled = false; //Disable app timeout
    
    this.btnStart.addEventListener('click', this.handleStart);
    document.addEventListener('keypress', this.handleKeyPress);
  }
  
  onRender(){
    // set title name to exericse name 
    this.lblTitle.text - config.exerciseName;
  }

  onUnmount(){
    this.btnStart.removeEventListener('click', this.handleStart);
    document.removeEventListener('keypress', this.handleKeypress);
  }
}
