import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class DashboardService {
    private jsonUrl = 'https://api.covid19india.org/states_daily.json';
    constructor(private http: Http) { }
    getCovidData(): Observable<any> {
        return this.http.get(this.jsonUrl).map((res: Response) => res.json().states_daily);
    }

  getVisibleStates() {
    return [{name  : 'Andaman and Nicobar', checked: false, key: 'an'},
            {name  : 'Andhra Pradesh', checked: false, key: 'ap'},
            {name  : 'Arunachal Pradesh', checked: false, key: 'as'},
            {name  : 'Assam', checked: false, key: 'as'},
            {name  : 'Bihar', checked: false, key: 'br'},
            {name  : 'Chandigarh', checked: false, key: 'ch'},
            {name  : 'Chhattisgarh', checked: false, key: 'ct'},
            {name  : 'Dadra and Nagar Haveli', checked: false, key: 'dn'},
            {name  : 'Daman and Diu', checked: false, key: 'dd'},
            {name  : 'Delhi', checked: false, key: 'dl'},
            {name  : 'Goa', checked: false, key: 'ga'},
            {name  : 'Gujarat', checked: false, key: 'gj'},
            {name  : 'Haryana', checked: false, key: 'hr'},
            {name  : 'Himachal Pradesh', checked: false, key: 'hp'},
            {name  : 'Jammu and Kashmir', checked: false, key: 'jk'},
            {name  : 'Jharkhand', checked: false, key: 'jh'},
            {name  : 'Karnataka', checked: false, key: 'ka'},
            {name  : 'Kerala', checked: false, key: 'kl'},
            {name  : 'Lakshadweep', checked: false, key: 'ld'},
            {name  : 'Madhya Pradesh', checked: false, key: 'mp'},
            {name  : 'Maharashtra', checked: true, key: 'mh'},
            {name  : 'Manipur', checked: false, key: 'mn'},
            {name  : 'Meghalaya', checked: false, key: 'ml'},
            {name  : 'Mizoram', checked: false, key: 'mz'},
            {name  : 'Nagaland', checked: false, key: 'nl'},
            {name  : 'Odisha', checked: false, key: 'or'},
            {name  : 'Puducherry', checked: false, key: 'py'},
            {name  : 'Punjab', checked: false, key: 'pb'},
            {name  : 'Rajasthan', checked: false, key: 'rj'},
            {name  : 'Sikkim', checked: false, key: 'sk'},
            {name  : 'Tamil Nadu', checked: false, key: 'tn'},
            {name  : 'Telangana', checked: false, key: 'tg'},
            {name  : 'Tripura', checked: false, key: 'tr'},
            {name  : 'Uttar Pradesh', checked: false, key: 'up'},
            {name  : 'Uttarakhand', checked: false, key: 'ut'},
            {name  : 'West Bengal', checked: false, key: 'wb'}];
  }
    // error handler
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purpose only
    return Promise.reject(error.body || error);
  }
}
