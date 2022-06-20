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
      return this.http.post(this.mainBeUrl + 'api/setEmployeeAttendance',JSON.stringify(data), this.httpOptions);
  }  
  getShiftDetailsByEmpId(empid:any):Observable<any>{
    return this.http.get(this.mainBeUrl+'api/getemployeeshift/'+empid, this.httpOptions);
  }
  getWorkypeList(tableName:any,status:any,page:any,size:any,companyName:any): Observable<any>{
    return this.http.get(this.mainBeUrl+'api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
  }
  setemployeeattendanceregularization(data:any):Observable<any>{
    return this.http.post(this.mainBeUrl+'api/setemployeeattendanceregularization',JSON.stringify(data),this.httpOptions);
  }
  updateAttendanceRequest(data:any):Observable<any>{
    return this.http.put(this.mainBeUrl+'api/setattendanceapprovalstatus',JSON.stringify(data),this.httpOptions);
  }
  getAttendanceRequestListByEmpId(employee_id:any): Observable<any>{
    return this.http.get(this.mainBeUrl + 'api/getemployeeattendanceregularization/'+employee_id, this.httpOptions);
  }
  getPendingAttendanceListByManagerEmpId(empid:any): Observable<any>{
    return this.http.post(this.mainBeUrl + 'api/getpendingattendanceregularizations/'+empid, this.httpOptions);
  }





}
