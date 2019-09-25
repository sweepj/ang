import {AfterViewChecked, AfterViewInit, Component, DoCheck, ElementRef, forwardRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {observableToBeFn} from 'rxjs/internal/testing/TestScheduler';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CountryService} from '../services/country.service';

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
          }
        });
          this.numberFromOutside(this.val);
      });

    this.numberForm.get('countryCode').valueChanges
      .subscribe(value => {
      for (const country of this.countries) {
        if (country.code === value) {
          this.findCountry = country.dial_code;
          if (country.regexp) {
            this.regexp = country.regexp.split(', ');
          }
          if (country.replaceVal) {
            this.replaceVal = country.replaceVal.split(', ');
          }
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
      countryDialCode = numberFromOutside.slice(0,2);
      this.countries.find(index => {
        if(countryDialCode === index.dial_code) {
          fullNumber = numberFromOutside.slice(2, numberFromOutside.length);
          this.numberForm.get('phoneNumber').patchValue(fullNumber);
        }
      });
      // исскуственный вызов события нажатие на клавишу
      this.elemRef.nativeElement.querySelector('#inputPhoneNumber').dispatchEvent(new KeyboardEvent('keydown'))
    }
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
