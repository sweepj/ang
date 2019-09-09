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
  private mask = [/\(?(\d\d\d)\)?/, /\(?(\d\d\d)\)?\s?(\d\d\d)/, /\(?(\d\d\d)\)?\s?(\d\d\d)\s?(\d\d)/
    , /\(?(\d\d\d)\)?\s?(\d\d\d)\s?(\d\d)\s?(\d\d)/];
  constructor(private ElemRef: ElementRef, private render: Renderer2, private customFormCom: CustomFormComponent) {}



  @HostListener('keydown', ['$event']) onKeyDown(event) {
    this.valueInput = event.target.value;
    if (event.key === 'Backspace') {
      // tslint:disable-next-line:no-debugger
      let positionCaret = this.ElemRef.nativeElement.selectionEnd;
      positionCaret--;
      console.log(typeof Number(event.target.value[positionCaret]));
      if ((event.target.value[positionCaret] === ' ')  (event.target.value ) {
        event.preventDefault();
        this.ElemRef.nativeElement.selectionEnd--;
      }
    }

    if (this.specialKeys[this.numbers].indexOf(event.key) !== -1) {
      return;
    }

    if (this.valueInput.length <= 3) {
      this.valueInput = this.valueInput.replace(this.mask[0], '($1)');
      console.log(this.valueInput.replace(this.mask[0], '($1)'));
    } else if (this.valueInput.length <= 8) {
      this.valueInput = this.valueInput.replace(this.mask[1], '($1) $2');
      console.log(this.valueInput);
    } else if (this.valueInput.length <= 11) {
      this.valueInput = this.valueInput.replace(this.mask[2], '($1) $2 $3 ');
      console.log(this.valueInput);
    }

    // if (this.valueInput.match(this.mask[0])) {
    //   debugger;
    //   console.log(this.valueInput.replace(this.mask[0], '($1)'));
    //   event.target.value = this.valueInput.replace(this.mask[0], '($1)');
    // }
    // if (this.valueInput.match(this.mask[1])) {
    //   console.log(this.valueInput.replace(this.mask[1], '-$2'));
    //   event.target.value = this.valueInput.replace(this.mask[1], '-$2');
    // }

    const current: string = this.ElemRef.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex[this.numbers]) || (event.target.value.length > 14)) {
      event.preventDefault();
    }
    event.target.value = this.valueInput;
  }
}
