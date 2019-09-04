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
    number: [ 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight']
  };

  private defaultCharBrackets = 2;
  constructor(private ElemRef: ElementRef, private render: Renderer2, private customFormCom: CustomFormComponent) {}

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    if (this.specialKeys[this.numbers].indexOf(event.key) !== -1) {
      return;
    }
    if (event.target.value.length === (this.customFormCom.findCountry.length + this.defaultCharBrackets)) {
      let valueInput = event.target.value.split('');
      valueInput = valueInput.splice(this.customFormCom.findCountry.length, this.customFormCom.findCountry.length +
        this.defaultCharBrackets);
      valueInput.unshift(' (');
      valueInput.push(') ');
      valueInput = valueInput.join('');
      event.target.value = this.customFormCom.findCountry + valueInput;
    }
    console.log(event);
    const current: string = this.ElemRef.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex[this.numbers])) {
      console.log(!String(next).match(this.regex[this.numbers]));
      event.preventDefault();
    }
  }
}
