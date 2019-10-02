import {Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormGroup, FormControl, Validator, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})

export class AppComponent implements OnInit {

  simpleForm = new FormGroup({
    name: new FormControl(null),
    number: new FormControl('+77783304444')
  });

  ngOnInit(): void {
    this.simpleForm.valueChanges.subscribe((value) => {
      console.log(value)
    })
  }

}
