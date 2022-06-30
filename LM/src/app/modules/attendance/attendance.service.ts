import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


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
      return this.http.post(this.mainBeUrl + 'attendance/api/setEmployeeAttendance',JSON.stringify(data), this.httpOptions);
  }  
  getShiftDetailsByEmpId(employee_id:any):Observable<any>{
    return this.http.get(this.mainBeUrl+'attendance/api/getemployeeshift/'+employee_id, this.httpOptions);
  }
  getgetemployeesByMangerId(employee_id:any):Observable<any>{
    return this.http.get(this.mainBeUrl+'attendance/api/getEmployeesByManagerId/'+employee_id, this.httpOptions);
  }
  getWorkypeList(tableName:any,status:any,page:any,size:any,companyName:any): Observable<any>{
    return this.http.get(this.mainBeUrl+'api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
  }
  setemployeeattendanceregularization(data:any):Observable<any>{
    return this.http.post(this.mainBeUrl+'attendance/api/setemployeeattendanceregularization',JSON.stringify(data),this.httpOptions);
  }
  updateAttendanceRequest(data:any):Observable<any>{
    return this.http.post(this.mainBeUrl+'attendance/api/setattendanceapprovalstatus',JSON.stringify(data),this.httpOptions);
  }
  getAttendanceRequestListByEmpId(employee_id:any): Observable<any>{
    return this.http.get(this.mainBeUrl + 'attendance/api/getemployeeattendanceregularization/'+employee_id, this.httpOptions);
  }
  getPendingAttendanceListByManagerEmpId(employee_id:any): Observable<any>{
    return this.http.get(this.mainBeUrl + 'attendance/api/getpendingattendanceregularizations/'+employee_id, this.httpOptions);
  }
  getAttendanceRegularizationByManagerId(manager_employee_id:any):Observable<any>{
    return this.http.get(this.mainBeUrl+'attendance/api/getAttendanceRegularizationByManagerId/'
    +manager_employee_id, this.httpOptions);
  }  

  getemployeeattendancedashboard(data:any):Observable<any>{
    return this.http.post(this.mainBeUrl +'attendance/api/getemployeeattendancedashboard',
    data,this.httpOptions
    )
  }


}
