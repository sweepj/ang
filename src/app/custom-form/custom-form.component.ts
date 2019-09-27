import {AfterViewChecked, AfterViewInit, Component, DoCheck, ElementRef, forwardRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {observableToBeFn} from 'rxjs/internal/testing/TestScheduler';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CountryService} from '../services/country.service';
import {count} from "rxjs/operators";

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

  @Input() defaultCountry = '';
  numberForm = new FormGroup({
    countryCode: new FormControl(null),
    phoneNumber: new FormControl(null,  [Validators.required,
      Validators.minLength(12)])
  });

  onTouched: () => void;
  private val = '';
  public countries = [];
  public findCountry: any;
  public regexp = [];
  public replaceVal = [];
  public maxLength: string;
  private onChange = (value: any) => {};

  ngOnInit(): void {
    this.countryService.getJSON()
      .subscribe(value => {
        this.countries = value;
        this.countries.find(i => {
          if (i.code === this.defaultCountry) {
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
          country.maxLength ? this.maxLength = country.maxLength : this.maxLength='';
          this.numberForm.get('phoneNumber').patchValue('');
        }
      }
    });

    this.numberForm.get('phoneNumber').valueChanges
      .subscribe(value => {
        this.clearNumberExcess(this.findCountry+value);
      });
  }

  clearNumberExcess(value) {
    value = value.replace(/\D/g, '');
    this.onChange(value);
  }

  numberFromOutside(numberFromOutside: string){
    let countryDialCode, fullNumber;
    if (this.val.length > 0) {
      this.countries.find(index => {
        countryDialCode = numberFromOutside.slice(0, (index.dial_code.length));
        if(countryDialCode === index.dial_code) {
          let countrySelect = this.autoSelectCountryNumberFromOutside(["IL", "RU", "UA"], countryDialCode);
          this.numberForm.get('countryCode').patchValue(countrySelect);
          fullNumber = numberFromOutside.slice(index.dial_code.length, numberFromOutside.length);
          this.numberForm.get('phoneNumber').patchValue(fullNumber);
        }
      });
      // исскуственный вызов события нажатие на клавишу
      this.elemRef.nativeElement.querySelector('#inputPhoneNumber').dispatchEvent(new KeyboardEvent('keyup'))
    }
  }

  autoSelectCountryNumberFromOutside(array: Array<string>, dialCode: string): string {
    let countryIsFind = '';
    this.countries.find(index => {
      if (countryIsFind.length === 0) {
        array.some(i => {
          if ((i === index.code) && (dialCode === index.dial_code)) {
            countryIsFind = index.code;
          }
        })
      }
    });
    return String(countryIsFind);
  }

  writeValue(value: string): void {
    this.val = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
  }
}
