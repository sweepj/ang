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
  constructor(private ElemRef: ElementRef, private render: Renderer2, private customFormCom: CustomFormComponent) {}



  @HostListener('keydown', ['$event']) onKeyDown(event) {
    this.valueInput = event.target.value;
    let positionCaret = this.ElemRef.nativeElement.selectionEnd;
    const tempValueInput = event.target.value.split('');
    const tempLength = tempValueInput.length;

    if (event.key === 'Backspace') {
      // удалениe
      if ((event.target.value[(positionCaret - 1)] === ' ') && ((positionCaret) !== event.target.value.length)) {
        event.preventDefault();
        this.ElemRef.nativeElement.selectionEnd--;
      } else if (((positionCaret + 1) !== event.target.value.length) && (event.target.value[(positionCaret - 1)] !== ' ')) {
        event.preventDefault();
        for (let i = 0; i < tempLength ; i++) {
          if ((i >= (positionCaret - 1)) && ((+tempValueInput[i] / +tempValueInput[i]) || (tempValueInput[i] === '0'))) {
            let y = i;
            for (let j = ++y; j < tempLength; j++) {
              if ((+tempValueInput[j] / +tempValueInput[j]) || (tempValueInput[j] === '0'))  {
                tempValueInput[i] = tempValueInput[i].replace(tempValueInput[i], tempValueInput[j]);
                break;
              }
            }
          }
          if (i === tempValueInput.length - 1) {
            tempValueInput.splice(tempValueInput.length - 1, 1);
          }
        }
        event.target.value = tempValueInput.join('');
        this.ElemRef.nativeElement.selectionStart = positionCaret--;
        this.ElemRef.nativeElement.selectionEnd = positionCaret--;
      }
    }

    if (this.specialKeys[this.numbers].indexOf(event.key) !== -1) {
      return;
    }

    if ((/\D/.test(event.key)) || (event.target.value.length === 15)) {
      event.preventDefault();
    } else {
      if (positionCaret < event.target.value.length - 1 ) {
        event.preventDefault();
        const tempVal = event.key;
        tempValueInput.splice(positionCaret, 0, tempVal);
        for ( let i = tempLength; i > 0 ; i-- ) {
          if ((i >= (positionCaret)) && ((+tempValueInput[i] / +tempValueInput[i]) || (tempValueInput[i] === '0'))) {
            let y = i;
            let temp;
            for (let j = ++y; j <= (event.target.value.length + 1); j++) {
              if ((y - 1) === event.target.value.length) {
                temp = tempValueInput[(y - 1)];
                tempValueInput.push(temp);
                break;
              }
              if ((+tempValueInput[j] / +tempValueInput[j]) || (tempValueInput[j] === '0')) {
                tempValueInput[j] = tempValueInput[j].replace(tempValueInput[j], tempValueInput[i]);
                break;
              }
            }
          }
        }
        tempValueInput.splice(positionCaret, 1);
        this.ElemRef.nativeElement.selectionEnd = positionCaret;
        this.valueInput = tempValueInput.join('');
      }
    }

    const replaceVal = this.customFormCom.replaceVal;
    const mask = this.customFormCom.regexp;
    this.maskInput(mask, replaceVal);
    event.target.value = this.valueInput;
  }

  simpleEvent() {
    const event = new CustomEvent('emptyEvent', {
      detail:{
      }
    });
  }

  maskInput(mask, replaceVal) {
    const glueArrayRegular = [];
    mask.forEach((item, index) => {
      if (index > 0) {
        glueArrayRegular.push(glueArrayRegular[index - 1] + item);
      } else {
        glueArrayRegular.push(item);
      }
    });
    for (let i = 0; i < mask.length; i++) {
      if (this.valueInput.match(RegExp(glueArrayRegular[i]))) {
        this.valueInput = this.valueInput.replace(RegExp(glueArrayRegular[i]), replaceVal[i]);
      }
    }
  }
}
