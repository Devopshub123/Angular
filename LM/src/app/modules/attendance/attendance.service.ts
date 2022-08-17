import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  mainUrl= environment.apiUrl;
  userSession: any;
  httpOptions = {
    headers: new HttpHeaders({'content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {
  }
  getMastertable(tableName:any,status:any,page:any,size:any,companyName:any):Observable<any>{
    return this.http.get(this.mainUrl+'api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
  }
  excelDataForAttendance(data:any): Observable<any> {
      return this.http.post(this.mainUrl + 'attendance/api/setEmployeeAttendance',JSON.stringify(data), this.httpOptions);
  }
  getShiftDetailsByEmpId(employee_id:any):Observable<any>{
    return this.http.get(this.mainUrl+'attendance/api/getemployeeshift/'+employee_id, this.httpOptions);
  }
  getgetemployeesByMangerId(employee_id:any):Observable<any>{
    return this.http.get(this.mainUrl+'attendance/api/getEmployeesByManagerId/'+employee_id, this.httpOptions);
  }
  getWorkypeList(tableName:any,status:any,page:any,size:any,companyName:any): Observable<any>{
    return this.http.get(this.mainUrl+'api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
  }
  setemployeeattendanceregularization(data:any):Observable<any>{
    return this.http.post(this.mainUrl+'attendance/api/setemployeeattendanceregularization',JSON.stringify(data),this.httpOptions);
  }
  updateAttendanceRequest(data:any):Observable<any>{
    return this.http.post(this.mainUrl+'attendance/api/setattendanceapprovalstatus',JSON.stringify(data),this.httpOptions);
  }
  getAttendanceRequestListByEmpId(employee_id:any): Observable<any>{
    return this.http.get(this.mainUrl + 'attendance/api/getemployeeattendanceregularization/'+employee_id, this.httpOptions);
  }
  getPendingAttendanceListByManagerEmpId(employee_id:any): Observable<any>{
    return this.http.get(this.mainUrl + 'attendance/api/getpendingattendanceregularizations/'+employee_id, this.httpOptions);
  }
  getAttendanceRegularizationByManagerId(manager_employee_id:any):Observable<any>{
    return this.http.get(this.mainUrl+'attendance/api/getAttendanceRegularizationByManagerId/'
    +manager_employee_id, this.httpOptions);
  }

  getemployeeattendancedashboard(data:any):Observable<any>{
    return this.http.post(this.mainUrl +'attendance/api/getemployeeattendancedashboard',
    data,this.httpOptions
    )
  }
  getAttendanceDetailsByAttendanceID(data:any):Observable<any>{
    return this.http.post(this.mainUrl +'attendance/api/getAttendanceDetailsByAttendanceID',
    data,this.httpOptions
    )
  }
  getEmployeeAttendanceNotifications(data:any):Observable<any>{
    return this.http.post(this.mainUrl +'attendance/api/getEmployeeAttendanceNotifications',
    data,this.httpOptions
    )
  }
  getEmployeeConfigureShifts(data:any):Observable<any>{
    return this.http.post(this.mainUrl +'attendance/api/getEmployeeConfigureShifts',
    data,this.httpOptions
    )
  }
  setEmployeeConfigureShift(data:any):Observable<any>{
    return this.http.post(this.mainUrl +'attendance/api/setEmployeeConfigureShift',
    data,this.httpOptions
    )
  }

  getActiveShiftIds():Observable<any>{
    return this.http.get(this.mainUrl +'admin/api/getActiveShiftIds',
    this.httpOptions
    )
  }
  //
  getAttendanceRegularizationsHistoryForManager(employee_id:any): Observable<any>{
    return this.http.get(this.mainUrl + 'attendance/api/getAttendanceRegularizationsHistoryForManager/'+employee_id, this.httpOptions);
  }

  deleteAttendanceRequestById(data:any):Observable<any>{
    return this.http.post(this.mainUrl +'attendance/api/deleteAttendanceRequestById',
    data,this.httpOptions
    )
  }
  getEmployeeShiftByDates(data:any):Observable<any>{
    return this.http.post(this.mainUrl+'attendance/api/getEmployeeShiftByDates',data,this.httpOptions)
  }
  getEmployeeCurrentShifts(data:any):Observable<any>{
    return this.http.post(this.mainUrl+'attendance/api/getEmployeeCurrentShifts',data,this.httpOptions)
  }
}
