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

}
