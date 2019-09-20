import {Component, forwardRef, Input, OnInit} from '@angular/core';
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


export class CustomFormComponent implements OnInit, ControlValueAccessor {

  constructor(private countryService: CountryService) { }

  numberForm = new FormGroup({
    countryCode: new FormControl(null),
    phoneNumber: new FormControl('',  [Validators.required,
      Validators.minLength(12)])
  });

  onTouched: () => void;
  private value: any;
  public countries = [];
  private valueCountryCode: string;
  public findCountry: any;
  public regexp = [];
  public replaceVal = [];

  @Input() defaultCountry = '';
  private onChange = (value: any) => {};

  ngOnInit() {
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
        this.clearNumberExcess(value);
        console.log(value);
        this.valueCountryCode = this.numberForm.get('countryCode').value;
        if (value.length < this.findCountry.length) {
          this.countries.find(i => {
            if (i.code === this.valueCountryCode) {
            }
          });
        }
      });
  }

  clearNumberExcess(value) {
    value = value.replace(/\D/g, '');
    this.onChange(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  writeValue(value: any): void {
    this.value = value;
  }


}
