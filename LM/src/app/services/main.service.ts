import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {Observable} from "rxjs/index";

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

  getProfileImage(info:any): Observable<any> {
    return this.http.post(this.mainBeUrl + 'api/getProfileImage/', info,this.httpOptions);
  }
  getCompoffleavestatus():Observable<any> {
    return this.http.get(this.mainBeUrl + 'api/getcompoffleavestatus') ;
  }
  getFilesMaster(info:any):Observable<any>{
    return this.http.post(this.mainBeUrl + 'api/getFilesMaster/', info,this.httpOptions);
  }
}
