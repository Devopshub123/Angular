import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  mainUrl= environment.apiUrl;
  userSession: any;
  httpOptions:any;

  companyName:any;

  constructor(private http: HttpClient) {
    this.companyName = sessionStorage.getItem("companyName");
    this.httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'application/json',
        "Authorization": JSON.parse(JSON.stringify(sessionStorage.getItem('token') || '')),
      })
    };
}

  getTotalEmployeslist(): Observable<any>{
    return this.http.get(this.mainUrl + 'attendance/api/getallemployeeslist/'+this.companyName,this.httpOptions);
  }
  getTotalEmployeslistByManagerId(data:any): Observable<any>{
    data.companyName = this.companyName;
    return this.http.post(this.mainUrl + 'attendance/api/getallemployeeslistByManagerId',data,this.httpOptions);
  }
  // ALL USER-WISE COLLECTION DATA API
  getAttendanceSummaryReport(data:any):Observable<any> {
    data.companyName = this.companyName;
    return this.http.post(this.mainUrl + 'attendance/api/getAttendanceSummaryReport'
    ,  data, this.httpOptions);
  }
  getAttendanceDetailsByAttendanceId(data:any):Observable<any>{
    data.companyName = this.companyName;
    return this.http.post(this.mainUrl +'attendance/api/getAttendanceDetailsByAttendanceId',
    data,this.httpOptions
    )
  }
  getAttendanceMonthlyReport(data:any):Observable<any>{
    data.companyName =this.companyName;
    return this.http.post(this.mainUrl +'attendance/api/getAttendanceMonthlyReport',
    data,this.httpOptions
    )
  }
  getEmployeeLateAttendanceReport(data:any):Observable<any>{
    data.companyName =this.companyName;
    return this.http.post(this.mainUrl +'attendance/api/getEmployeeLateAttendanceReport',
    data,this.httpOptions
    )
  }
}
