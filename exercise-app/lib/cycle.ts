// cycle read elements, ASK QUESTIONS
import {show, hide} from './utils';

// Cycle class, default export 
export default class Cycle{
  index: number = 0;
  
  constructor(container){
    // throw error if no container exists
    if(!container){
      throw new Error('Cycle parent element is undefined');
    }
    
    this.container = container;
    // HTML/View file grabs
    this.items = this.container.getElementsByClassName('item');
    this.touch = this.container.getElementById('touch');
    this.addEvents();
  }

  // check index for showing/hiding views
  next(): Void{
    this.index++;
    if(this.index >= this.items_length){
      this.index = 0;
    }
    
    this.items.forEach((item, index)) => {
      if(index === this.index){
        show(item);
      }
      else{
        hide(item);
      }
    });
  }
  
  addEvents(): Void{
    this.touch.addEventListener('click', this.next);
  }
  
  removeEvents(): Void{
    this.touch.removeEventListener('click', this.next);
  }
}