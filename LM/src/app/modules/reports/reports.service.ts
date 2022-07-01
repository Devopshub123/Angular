import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  allUsersCollectionReport(fromDate:any,toDate:any) {
    return this.http.get(this.mainUrl + 'bill/totalCollectionReport/' + fromDate + '/' +  toDate, this.httpOptions);
  }
  employeeCollectionReportByDatesByUserID(fromDate:any,toDate:any,userId:any) {
    return this.http.get(this.mainUrl + 'bill/totalCollectionReport/' + fromDate + '/' +  toDate+'?userId='+userId, this.httpOptions);
  }
}
