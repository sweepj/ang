import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators} from "@angular/forms";
import {observableToBeFn} from "rxjs/internal/testing/TestScheduler";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {CountryService} from "../services/country.service";


@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.sass'],
  providers:[{
    provide : NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomFormComponent),
    multi: true
  }]
})


export class CustomFormComponent implements OnInit, ControlValueAccessor {

  onTouched: () => void;
  onChange: (value: any) => void;

  numberForm = new FormGroup({
    countryCode: new FormControl(null),
    phoneNumber: new FormControl('',  [Validators.required,
      Validators.minLength(12)]),
    testInput: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')])
  });

  constructor(private countryService: CountryService) { }

  @Input() defaultCountry: string = '';

  public countries = [];
  private idCountry: number;
  private findCountry: any;

  set value(val){
    // this.numberForm.get('phoneNumber').valueChanges.subscribe(value => {
    //   this.idCountry = this.numberForm.get('countryId').value;
    //   console.log(this.findCountry.length);
    //   if(value.length < this.findCountry.length) {
    //     this.numberForm.get('phoneNumber').patchValue(this.countries[--this.idCountry].code);
    //     this.onChange = value;
    //   }
    // })
  }

  ngOnInit() {

    this.countryService.getJSON()
      .subscribe(value => {
        this.countries = value;
        this.countries.find(i => {
          if(i.code === this.defaultCountry){
            this.numberForm.get('countryCode').patchValue(i.code);
          }
        })
      });

    this.numberForm.get('countryCode').valueChanges
      .subscribe(value => {
      for(let country of this.countries){
        if(country.code === value){
          this.findCountry = country.dial_code;
          this.numberForm.get('phoneNumber').patchValue(country.dial_code);
        }
      }
    });

    this.numberForm.get('phoneNumber').valueChanges.subscribe(value => {
      this.idCountry = this.numberForm.get('countryCode').value;
      if(value.length < this.findCountry.length) {
        this.countries.find(i => {
          if (i.code === this.idCountry){
            this.numberForm.get('phoneNumber').patchValue(i.dial_code);
            this.onChange = value;
          }
        });
      }
    })
  }


  registerOnChange(fn: any): void {
    this.onChange = fn
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
