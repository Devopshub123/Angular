import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type':  'application/json',
//   })
// };

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  mainBeUrl= environment.apiUrl;
  userSession: any;
  httpOptions = {
    headers: new HttpHeaders({'content-Type': 'application/json'})
  };  
 
  constructor(private http: HttpClient) {



  }
  excelDataForAttendance(data:any): Observable<any> {

    return this.http.post(this.mainBeUrl + 'api/setEmployeeAttendance', JSON.stringify(data) ,this.httpOptions);
  }  
  // excelDataForAttendance(data:any) {
  //   return this.http.post(this.mainBeUrl + 'api/setEmployeeAttendance',
  //   data, { headers: httpOptions.headers, responseType: 'text' });
  // }





}
