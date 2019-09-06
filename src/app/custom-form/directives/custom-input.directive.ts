import {Directive, ElementRef, forwardRef, HostListener, Input, Renderer2} from '@angular/core';
import {CustomFormComponent} from '../custom-form.component';

@Directive({
  selector: '[appCustomInput]'
})
export class CustomInputDirective {

  @Input('numbers') numbers: string;

  private regex = {
    number: new RegExp(/^[+]\d\s\d\s|\d+$/)
  };

  private specialKeys = {
    number: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight']
  };

  private valueInput;
  private defaultCharBrackets = 3;
  constructor(private ElemRef: ElementRef, private render: Renderer2, private customFormCom: CustomFormComponent) {}



  @HostListener('keydown', ['$event']) onKeyDown(event) {
    this.valueInput = event.target.value;
    if(event.key === 'Backspace') {
      debugger
      let positionCaret = this.ElemRef.nativeElement.selectionEnd;
      positionCaret--;
      console.log(typeof Number(event.target.value[positionCaret]));
      if (event.target.value[positionCaret] === "-"){
        event.preventDefault();
      }
    }

    if (this.specialKeys[this.numbers].indexOf(event.key) !== -1) {
      return;
    }

    event.target.value = this.valueInput.replace(/^(\d{3})/, '($1) ');
    if(event.target.value.length >= 7){
      event.target.value = this.valueInput.replace(/\s(\d{3})(\d{2})/, ' $1-$2-');
    }

    // if (event.target.value.length === (this.customFormCom.findCountry.length + this.defaultCharBrackets)) {
    //   let valueInput = event.target.value;

      // let valueInput = event.target.value.split('');
      // valueInput = valueInput.splice(this.customFormCom.findCountry.length, this.customFormCom.findCountry.length +
      //   this.defaultCharBrackets);
      // console.log(valueInput);
      // // valueInput.unshift(' (');
      // valueInput.push(') ');
      // valueInput = valueInput.join('');
      // event.target.value = this.customFormCom.findCountry + valueInput;
    // }
    // if(event.key === 'Backspace'){
    //   event.preventDefault();
    //   event.target.value = event.target.value.substr(0, (event.target.value.length));
    // }

    const current: string = this.ElemRef.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex[this.numbers]) || (event.target.value.length > 14)) {
      event.preventDefault();
    }
  }
}
