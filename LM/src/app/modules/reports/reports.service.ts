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
  httpOptions = {
    headers: new HttpHeaders({'content-Type': 'application/json'})
  };  
 
  constructor(private http: HttpClient) {
}
  
  getTotalEmployeslist(): any{
    return this.http.get(this.mainUrl + 'attendance/api/getallemployeeslist',this.httpOptions);
  } 
  // ALL USER-WISE COLLECTION DATA API
  getAttendanceSummaryReport(data:any):Observable<any> {
    return this.http.post(this.mainUrl + 'attendance/api/getAttendanceSummaryReport'
    ,  data, this.httpOptions);
  }
  employeeCollectionReportByDatesByUserID(fromDate:any,toDate:any,userId:any) {
    return this.http.get(this.mainUrl + 'bill/totalCollectionReport/' + fromDate + '/' +  toDate+'?userId='+userId, this.httpOptions);
  }
}
