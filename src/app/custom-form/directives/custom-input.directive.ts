import {Directive, ElementRef, forwardRef, HostListener, Input, Renderer2} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Directive({
  selector: '[appCustomInput]'
})
export class CustomInputDirective {

  @Input('numbers') numbers: string;

  private regex = {
    number: new RegExp(/^[+]\d{3}([(]\d{3}[)])+$/)
  };

  private specialKeys = {
    number: [ 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight' ]
  };

  constructor(private ElemRef: ElementRef, private render: Renderer2) {}

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys[this.numbers].indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.ElemRef.nativeElement.value;
    console.log(event);
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex[this.numbers])) {
      event.preventDefault();
    }
  }
}
