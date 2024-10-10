import { gameStarted, speed as mainSpeed } from "./app.js";
const character = document.querySelector("#object");
const blockFrame = document.querySelector("#blockFrame");

export class RunnerObject {
  name;

  src= '';
  speed ;
  stopRunV = false;
  constructor(name,myspeed) {
    this.name = name;
    this.speed = myspeed;
    
  }
  run(){
    this.stopRunV = false
    let timer = setInterval(() => { 
        if(this.stopRunV) clearInterval(timer)
        if(!gameStarted) clearInterval(timer)
        for (let i = 0; i < blockFrame.children.length; i++) {
          let item = blockFrame.children[i];
          if (item.getAttribute("data") != this.name) continue;
    
          const rightCalc = parseInt(item.style.right) + mainSpeed;
          item.style.right = (rightCalc + this.speed +2) + "px";
    
          const charLeft = character.offsetLeft;
          const charW = character.offsetWidth;
          const blockLeft = item.offsetLeft;
          const blockW = item.offsetWidth;
    
          const charTop = character.offsetTop;
          const charH = character.offsetHeight;
          const blockTop = item.offsetTop;
          const blockH = item.offsetHeight;

          if (item?.offsetLeft < 0) {
            item.remove();
            continue;
          }
    
          if (
            charLeft + charW > blockLeft && !(blockLeft + blockW < charLeft) && charTop + charH > blockTop && !(blockTop + blockH < charTop)
          ) {
            if(!item.getAttribute('called')){
                item.setAttribute('called',true)
                if(this.action) this.action(item);
            }
          }
        }
      }, 40);

      
  }


    stopRun() {
    this.stopRunV = true
     }

  action;

  createData = {width: 30,height:30,classes: '',src: '', style: ''} 
  create() {
    blockFrame.innerHTML += `<${this.createData.src == '' ? 'div' : `img src=${this.createData.src}`} style="right: 0; ${this.createData.style} " data="${this.name}" class=" ${this.createData.classes} w-[${this.createData.width}px] h-[${this.createData.height}px] absolute"></${this.createData.src == '' ? 'div' : 'img'}>`;
  }
  removeLast(called = false){
    for (let i = 0; i < blockFrame.children.length; i++) {
        if(blockFrame.children[i].getAttribute('data') == this.name){
            if(called) if (!blockFrame.children[i].hasAttribute('called')) continue;
            blockFrame.children[i]?.remove()
            break;
        }
        
    }
    
    
  }
}
