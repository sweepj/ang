import {Directive, ElementRef, forwardRef, HostListener, Input, Renderer2} from '@angular/core';
import {CustomFormComponent} from '../custom-form.component';

// @ts-ignore
@Directive({
  selector: '[appCustomInput]'
})
export class CustomInputDirective {

  @Input('numbers') numbers: string;

  private specialKeys = {
    number: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Ctrl']
  };

  private valueInput;
  constructor(private ElemRef: ElementRef, private render: Renderer2, private customFormCom: CustomFormComponent) {}

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    if ((this.specialKeys[this.numbers].indexOf(event.key) !== -1) || (event.ctrlKey && event.keyCode === 86)) {
      return;
    }

    if ((/\D/.test(event.key)) || (event.target.value.length === +this.customFormCom.maxLength)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event']) onPaste(event) {
    event.preventDefault();
    const bufferData = event.clipboardData.getData('text/plain');
    if (bufferData[0] !== '+') {
      alert('Вставьте пожалуйста номер с кодом страны ' + this.customFormCom.findCountry);
    } else {
      this.customFormCom.numberFromOutside(bufferData);
    }
  }

  @HostListener('keyup', ['$event']) onKeyup(event) {
    this.valueInput = event.target.value;
    const valueLastLength = this.valueInput.length;
    let positionCaret = this.ElemRef.nativeElement.selectionEnd;
    if ((/\D/.test(event.key))) {
      event.preventDefault();
    } else {
      const replaceVal = this.customFormCom.replaceVal;
      const mask = this.customFormCom.regexp;
      this.valueInput = this.valueInput.replace(/\D/g, '');
      this.maskInput(mask, replaceVal);
      this.customFormCom.numberForm.get('phoneNumber').setValue(this.valueInput);
      if (positionCaret === valueLastLength) {
        positionCaret = this.ElemRef.nativeElement.selectionStart;
      }
      if ((positionCaret !== +this.customFormCom.maxLength)) {
        this.ElemRef.nativeElement.selectionStart = positionCaret;
        this.ElemRef.nativeElement.selectionEnd = positionCaret;
      }
    }

    if (event.key === 'Backspace') {
      const replaceVal = this.customFormCom.replaceVal;
      const mask = this.customFormCom.regexp;
      this.valueInput = this.valueInput.replace(/\D/g, '');
      this.maskInput(mask, replaceVal);
      this.customFormCom.numberForm.get('phoneNumber').setValue(this.valueInput);
      this.ElemRef.nativeElement.selectionStart = positionCaret;
      this.ElemRef.nativeElement.selectionEnd = positionCaret;
    }
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
