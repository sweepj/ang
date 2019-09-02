import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs';
import {CustomFormComponent} from '../custom-form/custom-form.component';
import {Country} from "../interfaces/country";

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient) {}

  getJSON(): Observable<Country[]> {
    return this.http.get<Country[]>('/assets/CountryCodes.json');
  }
}
