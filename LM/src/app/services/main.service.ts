import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  mainBeUrl= environment.apiUrl;
  userSession: any;
  httpOptions = {
    headers: new HttpHeaders({'content-Type': 'application/json'})
  };  
 
  constructor(private http: HttpClient) {
  }
/*Get Role Screen Functionalities*/
  getRoleScreenFunctionalities(data: any) {

    return this.http.post(this.mainBeUrl + 'attendance/api/getrolescreenfunctionalities',data, this.httpOptions);

  }
/*Get Role Screen Functionalities Based on RoleId*/
  getrolescreenfunctionalitiesforrole(data: any) {

    return this.http.post(this.mainBeUrl + 'attendance/api/getrolescreenfunctionalitiesforrole',data, this.httpOptions);

  }
}
