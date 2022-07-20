import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class LeavesService {
  mainUrl= environment.apiUrl;
  userSession: any;
  httpOptions = {
    headers: new HttpHeaders({'content-Type': 'application/json'})
  };
  constructor(private http: HttpClient) { }

  getLeavesForApprovals(id:any): any{
    return this.http.get(this.mainUrl + 'api/getLeavesForApprovals/'+id,this.httpOptions);
  }

  setApproveOrReject(data:any): any{
    console.log("hheheh",data)
    return this.http.post(this.mainUrl + 'api/setLeaveStatus',data,this.httpOptions);
  }
  getErrorMessages(errorCode:any,page:any, size:any): Observable<any> {
    return this.http.get(this.mainUrl +'api/getErrorMessages/' + errorCode + '/' + page + '/' + size, this.httpOptions);
  }


  getCompoffForApprovals(id:any): any{
    return this.http.get(this.mainUrl + 'api/getCompoffsForApproval/'+id,this.httpOptions);
  }
  setCompoffForApproveOrReject(data:any): any{
    console.log("hheheh",data)
    return this.http.post(this.mainUrl + 'api/setCompoffForApproveOrReject',data,this.httpOptions);
  }

  getHandledLeaves(id:any): any{
    return this.http.get(this.mainUrl + 'api/getHandledLeaves/'+id,this.httpOptions);
  }
  getCompoffs(data:any): any{
    return this.http.post(this.mainUrl + 'api/getCompoffs',data,this.httpOptions);
  }
  getMastertable(data:any):Observable<any>{
    return this.http.post(this.mainUrl + 'api/getMastertables',data,this.httpOptions);
  }
  getEmployeesForReportingManager(id:any):Observable<any>{
    return this.http.get(this.mainUrl + 'api/getEmployeesForReportingManager/'+id,this.httpOptions);
  }
  getEmployeeLeaveDetailedReportForManager(data:any):Observable<any>{
    return this.http.post(this.mainUrl + 'api/getEmployeeLeaveDetailedReportForManager',data,this.httpOptions);
  }
  /**Get Leave History */
  getleavehistory(empid:any,page:any,size:any) :Observable<any>{
    return this.http.get(this.mainUrl +'api/getemployeeleaves/'+empid+'/'+page+'/'+size, this.httpOptions);
}
/**Leave Balance */
getLeaveBalance(empid:any): Observable<any> {
  return this.http.get(this.mainUrl+'api/getLeaveBalance/'+empid,this.httpOptions);
}
}
