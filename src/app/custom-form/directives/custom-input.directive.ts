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

  private defaultCharBrackets = 3;
  constructor(private ElemRef: ElementRef, private render: Renderer2, private customFormCom: CustomFormComponent) {}

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let valueInput = event.target.value;
    if (this.specialKeys[this.numbers].indexOf(event.key) !== -1) {
      return;
    }
    console.log(valueInput);
    if(event.target.value.length === 3){
      console.log(valueInput);
      event.target.value = valueInput.replace(/^(\d{0,3})/g, "($1)");
    }else if(event.target.value.length === 6){
      console.log(valueInput.replace(/^(\d{0,3}) (\d{0,3})/g, "($1) $2"));
      event.target.value = valueInput.replace(/^(\d{0,3}) (\d{0,3})/g, "($1) $2");
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
    if (next && !String(next).match(this.regex[this.numbers]) || (event.target.value.length > 15)) {
      event.preventDefault();
    }
  }
}
