import {Directive, ElementRef, forwardRef, HostListener, Input, Renderer2} from '@angular/core';
import {CustomFormComponent} from '../custom-form.component';

@Directive({
  selector: '[appCustomInput]'
})
export class CustomInputDirective {

  @Input('numbers') numbers: string;

  private regex = {
    number: new RegExp(/[+]\d\s\d\s|\d+$/)
  };

  private specialKeys = {
    number: [ 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight']
  };

  constructor(private ElemRef: ElementRef, private render: Renderer2, private customFormCom: CustomFormComponent) {}
  temp = [];

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    // if (event.target.value.length === this.customFormCom.findCountry.length) {
    //   event.target.value = event.target.value + ' ';
    // }
    if (this.specialKeys[this.numbers].indexOf(event.key) !== -1) {
      return;
    }
    if (event.target.value.length === 5) {
      let valueInput = event.target.value.split('');
      valueInput = valueInput.splice(2, 6);
      valueInput.unshift(' (');
      valueInput.push(') ');
      valueInput = valueInput.join('');
      event.target.value = this.customFormCom.findCountry + valueInput;
      // event.target.value = valueInput + this.temp.join('');
    }   else {
      // this.temp = [];
    }
    this.temp.push(event.key);
    console.log(this.temp);
    const current: string = this.ElemRef.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex[this.numbers])) {
      console.log(!String(next).match(this.regex[this.numbers]));
      event.preventDefault();
    }
  }
}
