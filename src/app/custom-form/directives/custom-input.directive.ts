import {Directive, ElementRef, forwardRef, HostListener, Input, Renderer2} from '@angular/core';
import {CustomFormComponent} from '../custom-form.component';

@Directive({
  selector: '[appCustomInput]'
})
export class CustomInputDirective {

  @Input('numbers') numbers: string;

  private specialKeys = {
    number: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight']
  };

  private valueInput;
  private defaultCharBrackets = 3;
  constructor(private ElemRef: ElementRef, private render: Renderer2, private customFormCom: CustomFormComponent) {}



  @HostListener('keydown', ['$event']) onKeyDown(event) {

    if (event.key === 'Backspace') {
      let positionCaret = this.ElemRef.nativeElement.selectionEnd;
      let tempValueInput = event.target.value.split('');
      if ((event.target.value[(positionCaret-1)] === ' ') && ((positionCaret+1) !== event.target.value.length)){
        event.preventDefault();
        this.ElemRef.nativeElement.selectionEnd--;
      } else if(((positionCaret+1) !== event.target.value.length) && (event.target.value[positionCaret] !== ' ')) {
        let tempLength = tempValueInput.length;
        let count=0;
        for (let i = 0; i < tempLength ; i++){
          let y = i;
          if(i >= (positionCaret-1)){
            if ((tempValueInput[i] === ')') && (tempValueInput[(y+1)]===' ')) {
              count+=2;
              i++;
            } else if ((tempValueInput[i] === '(') || (tempValueInput[(y+1)]==='(')) {
              count++;
            } else if((tempValueInput[i] === ' ') || (tempValueInput[(y+1)] ===' ')){
              count++
            } else if ((tempValueInput[i] === '-') || (tempValueInput[(y+1)]==='-')) {
              count++;
            } else if ((tempValueInput[i] === ')') || (tempValueInput[(y+1)]===')')) {
              count++;
            } else {
              if(count > 0){
                tempValueInput[(i-count)] = tempValueInput[(i-count)].replace(tempValueInput[(i-count)], tempValueInput[y]);
                count=0;
              } else {
                tempValueInput[i] = tempValueInput[i].replace(tempValueInput[i], tempValueInput[++y]);
              }
            }
          }
          if(i === tempValueInput.length-1){
            tempValueInput.splice(tempValueInput.length-1, 1);
          }
          console.log(tempValueInput);
        }
        event.preventDefault();
      }
    }
    this.valueInput = event.target.value;
    if (this.specialKeys[this.numbers].indexOf(event.key) !== -1) {
      return;
    }

    if((/\D/.test(event.key)) || (event.target.value.length === 15)){
      event.preventDefault();
    }

    let replaceVal = this.customFormCom.replaceVal;
    let mask = this.customFormCom.regexp;
    this.maskInput(mask,replaceVal,event);
    event.target.value = this.valueInput;
  }


  maskInput(mask,replaceVal,e) {
    for (let i = 0; i < mask.length; i++) {
      if (this.valueInput.match(RegExp(mask[i]))) {
        this.valueInput = this.valueInput.replace(RegExp(mask[i]), replaceVal[i]);
      }
    }
  }

}
