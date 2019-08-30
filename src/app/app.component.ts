import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validator, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export interface Country {

  id: number;
  name: string;
  code: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})

export class AppComponent implements OnInit{

  countries: Country[] = [
    {id: 1, name: 'Russia', code: '7'},
    {id: 2, name: 'Ukraine', code: '380'}
  ];


  ngOnInit(): void {
  }


}
