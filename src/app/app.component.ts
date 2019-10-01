import {Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormGroup, FormControl, Validator, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})

export class AppComponent implements OnInit {

  appState = '+79797701284';

  ngOnInit(): void {

  }

  onClick(){
    console.log(this.appState);
  }

}
