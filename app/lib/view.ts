// views script for UI display

import document from "document";
import {display} from "display";

// Main HTML/Views DOM search func
export function $(query: string, el){
  const selectors = query.match(/\.|#|\S+/g);
  let root = el || document;
  
  for(let i=0; root && i<selectors.length; i++){
    const s= selectors[i];
    root = 
      s === '#'
        ? $id(selectors[++i], root): s ==='.'
          ? $classAndType("getElementsByClassName", selectors[++i], root): 
            $classAndType("getElementsByTypeName", s, root)
  }
  return root; 
}

// Search subtress by id, internal function
function $id(id, arr){
  // check if arr is of object type array
  if(Array.isArray(arr)){
    const res = [];
  
    for(let i = arr.length; i--;){
      const x = arr[i].getElementById(id);
      // if x exists, push it to the res array
      if (x) res.push(x);
    }
    return res;
  } 
  return arr.getElementsById(id);
}

// Search subtrees by class & type
function $classAndType(method, args, arr){
  if(Array.isArray(arr)){
    const res = [];
    
    for(let i=arr.length; i--;){
      const el = arr[i][method](arg);
      for(let j=el.lengthl j--;){
        res.push(el[j]);
      }
    }
    return res;
  }
  return arr[method](args);
}

// wrap helper, arrow function
export function $wrap(element){
  return selector => (selector ? $(selector, element): element);
}

// wrap at
export function $at(selector){
  return $wrap($(selector));
}

// show helper, depends on view style and visibility
function show(view, yes: boolean): Void{
  const {el} = view;
  if (el) el.style.display = yes?'inline':'none';
}

// mount desired view
function mount(view){
  //flip view show
  show(view, true);
  view.onMount(view.options);
}

// unmount desired view
function unmount(view){
  //remove subviews from view
  const {_subviews} =view;
  if(_subviews){
    let i = _subviews.length;
    // recursive func
    while(i--) unmount(_subviews[i]);
    
    delete view._subviews;
  }
  
  view.onUnmount();
  //flip view show
  show(view, false);
}

// view class
export class View{
  constructor(options){
    // set options if options exist
    if (options) this.options =options;
  }
  
  //helper for interting subview
  insert(subview){
    //set subviews total given options, or to empty list if not given subviews
    const subviews = this._subviews || (this._subviews = []);
    // add new subview
    subviews.push(subview);
    // mount added subview
    mount(subview);
    // return updated options
    return this;
  }
  
  remove(subview): Void{
    const _subviews: object = this;
    // remove desired subview
    _subviews.splice(_subviews.indexOf(subview),1)
    // unmount removed subview
    unmount(subview);
  }
  
  render(): Void{
    // if FitBit display is on, render 
    if(display.on){
      const _subviews: object = this;
      // if _subviews is not None
      if(_subviews) 
        //render subview in _subviews
        for(let i=_subvews.length; i--;){
          _subviews[i].render()
        }
      this.onRender();
    }
  }
}

// ASK QUESTIONS
const ViewProto: obect = View.prototype;
ViewProto.onKeyBack = ViewProto.onKeyDown = ViewProto.onKeyUp = ViewProto.onMount = ViewProto.onUnmount = ViewProto.onRender = function() {};


//App class
export class Application extends View{
  //delete current screen, poke the screen, and insert new screen & render
  setScreen(s): Void{
    if(this.screen) this.remove(this.screen);
    display.poke();
    this.insert((this.screen =s)).render();
  }


  // switch screens in app
  static switchTo(screenName: string){
    const instance: object = Application;
    instance.setScreen(new instance.screens[screenName]());
  }

  // start up screen - instantiate and mount application
  static start(screen){
    // load up current state of 'this'
    const app = (Application.instance = new this());
    Application.switchTo(screen);
    mount(app);
    
    // refresh UI when screen is on, arrow function to re-render on any display changes
    display.onchange = () => {
      app.render();    
    }
    
    // manage key presses to trigger events in HTML/View
    document.onkeypress = (evt) => {
      if(evt.key === 'back') app.onKeyBack(evt);
      else if(evt.key === 'down') app.onKeyDown(evt);
      else if(evt.key === 'up') app.onKeyUp(evt);
    };
  }

  //set back key event
  onKeyBack(evt): Void{
    this.screen.onKeyBack(evt);
  }

  //set back down event
  onKeyDown(evt): Void{
    this.screen.onKeyDown(evt);
  }
  
  //set back up event
  onKeyUp(evt): Void{
    this.screen.onKeyUp(evt);
  }
}
