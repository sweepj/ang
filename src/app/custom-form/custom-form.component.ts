import {Component, DoCheck, ElementRef, forwardRef, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {observableToBeFn} from 'rxjs/internal/testing/TestScheduler';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CountryService} from '../services/country.service';
import {count} from 'rxjs/operators';

@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.sass'],
  providers: [{
    provide : NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomFormComponent),
    multi: true
  }]
})

export class CustomFormComponent implements
  OnInit,
  ControlValueAccessor {

  constructor(private countryService: CountryService, private render: Renderer2, private elemRef: ElementRef) { }

  @Input() default;
  numberForm = new FormGroup({
    countryCode: new FormControl(null),
    phoneNumber: new FormControl(null,  [Validators.required])
  });

  onTouched: () => void;
  private val = '';
  private clickLiElement = 'AL';
  public countries = [];
  public findCountry: any;
  public regexp = [];
  public replaceVal = [];
  public maxLength: number;
  private autoSelectCountry = ['IL', 'RU', 'UA', 'KZ'];
  public triggerModal = false;
  private onChange = (value: any) => {};

  ngOnInit(): void {
    this.countryService.getJSON()
      .subscribe(value => {
        this.countries = value;
        this.countries.find(i => {
          if (i.code === this.default.country) {
            this.numberForm.get('countryCode').patchValue(i.code);
            this.regexp = i.regexp.split(', ');
            this.replaceVal = i.replaceVal.split(', ');
            this.maxLength = i.maxLength;
          }
        });
        this.numberFromOutside(this.val);
      });

    this.numberForm.get('countryCode').valueChanges
      .subscribe(value => {
      for (const country of this.countries) {
        if (country.code === value) {
          this.findCountry = country.dial_code;
          country.regexp ? this.regexp = country.regexp.split(', ') : this.regexp = [];
          country.replaceVal ? this.replaceVal = country.replaceVal.split(', ') : this.replaceVal = [];
          country.maxLength ? this.maxLength = +country.maxLength : this.maxLength = this.default.minlen;
          this.numberForm.get('phoneNumber').patchValue('');
        }
      }
    });

    this.numberForm.get('phoneNumber').valueChanges
      .subscribe(value => {
        if (value.length > 0) {
          this.clearNumberExcess(this.findCountry + value);
        } else {
          this.onChange(value);
        }
      });
  }

  clearNumberExcess(value) {
    value = value.replace(/\D/g, '');
    this.onChange(value);
  }

  numberFromOutside(numberFromOutside: string) {
    // tslint:disable-next-line:one-variable-per-declaration
    let countryDialCode, fullNumber;
    let countrySelect;
    if (numberFromOutside.length > 0) {
      this.countries.find(index => {
        const temp = index.dial_code.replace(/\s/g, '');
        countryDialCode = numberFromOutside.slice(0, temp.length);
        if ((countryDialCode === temp)) {
          countrySelect = this.autoSelectCountryNumberFromOutside(this.autoSelectCountry, countryDialCode);
          this.numberForm.get('countryCode').patchValue(countrySelect);
          fullNumber = numberFromOutside.slice(index.dial_code.length, numberFromOutside.length);
          this.numberForm.get('phoneNumber').patchValue(fullNumber);
          if (countrySelect) {
            return true;
          }
        }
      });
      // исскуственный вызов события нажатие на клавишу
      this.elemRef.nativeElement.querySelector('#inputPhoneNumber').dispatchEvent(new KeyboardEvent('keyup'));
    }
  }

  autoSelectCountryNumberFromOutside(array: Array<string>, dialCode: string): string {
    let countryIsFind = '';
    this.countries.find(index => {
      if (countryIsFind.length === 0) {
        array.some(i => {
          if ((i === index.code) && (dialCode === index.dial_code.replace(/\s/g, ''))) {
            countryIsFind = index.code;
          }
        });
      }
    });
    return String(countryIsFind);
  }
  //
  // closeModal(){
    //   this.triggerModal = false;
    // }

  writeValue(value: string): void {
    this.val = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  valueBlock(event) {
    this.clickLiElement = event.target.outerText;
    console.log(event.target.outerText);
  }
}
