import {Directive, ElementRef, forwardRef, HostListener, Input, Renderer2} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {CustomFormComponent} from "../custom-form.component";

@Directive({
  selector: '[appCustomInput]'
})
export class CustomInputDirective{

  @Input('numbers') numbers : string;

  private regex = {
    number: new RegExp(/[+]\d\s\d\s|\d+$/)
  };

  private specialKeys = {
    number: [ 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight']
  };

  constructor(private ElementRef: ElementRef, private render: Renderer2, private customFormCom: CustomFormComponent) {}


  @HostListener('keydown', ['$event']) onKeyDown(event){
    if(event.target.value.length === this.customFormCom.findCountry.length){
      event.target.value = event.target.value+" "
    }
    if(this.specialKeys[this.numbers].indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.ElementRef.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex[this.numbers])){
      console.log(!String(next).match(this.regex[this.numbers]));
      event.preventDefault();
    }
  }
}
