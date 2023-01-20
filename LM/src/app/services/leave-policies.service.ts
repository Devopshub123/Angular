import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {environment} from '../../environments/environment'


@Injectable({
    providedIn: 'root'
})
export class LeavePoliciesService {
  httpOptions:any;
  companyName:any
    constructor(private hClient: HttpClient) {
    this.companyName = sessionStorage.getItem('companyName');
    this.httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'application/json',
        "Authorization": JSON.parse(JSON.stringify(sessionStorage.getItem('token') || '')),
      })
    };
    }

    


    url: any = environment.apiUrl;



    setAddLeaveBalance(info:any) {
        return this.hClient.post(this.url + 'api/setAddLeaveBalance', JSON.stringify(info), this.httpOptions);
    }

    getLeaveTypes(tableName:any, page:any, size:any): Observable<any> {
        return this.hClient.get(this.url + 'api/getLeaveTypes/' + tableName + '/' + page + '/' + size, this.httpOptions);

    }

    getLeavePolicies(cId:any, isCommonRule:any, page:any, size:any): Observable<any> {
        return this.hClient.get(this.url + 'api/getLeavePolicies/' + cId + '/' + isCommonRule + '/' + page + '/' + size+'/'+this.companyName, this.httpOptions);

    }
    getleavetypesforadvancedleave(): Observable<any> {
      return this.hClient.get(this.url + 'api/getLeaveTypesForAdvancedLeave/'+this.companyName, this.httpOptions);

    }

    getLeaves(page:any, size:any): Observable<any> {
        return this.hClient.get(this.url + 'api/getLeaves/' + page + '/' + size, this.httpOptions);

    }

    getLeaveRules(Id:any, page:any, size:any): Observable<any> {
        return this.hClient.get(this.url + 'api/getLeaveRules/' + Id + '/' + page + '/' + size, this.httpOptions);

    }

    getAddLeaveBalance() {
        return this.hClient.get(this.url + 'api/getAddLeaveBalance', {responseType: 'json'});

    }

    putAddLeaveBalance(info:any) {
        return this.hClient.put(this.url + 'api/putAddLeaveBalance', JSON.stringify(info), this.httpOptions);

    }

    deleteAddLeaveBalance(leaveBalanceId:any) {
        return this.hClient.delete(this.url + 'api/deleteAddLeaveBalance/' + leaveBalanceId, this.httpOptions);

    }

    setLeaveConfigure(info:any): Observable<any> {
      info.companyName = this.companyName;
        return this.hClient.post(this.url + 'api/setLeavePolicies', JSON.stringify(info), this.httpOptions);

    }
  setAdvancedLeaveRuleValues(info:any): Observable<any> {
    info.companyName=this.companyName;
    return this.hClient.post(this.url + 'api/setAdvancedLeaveRuleValues', JSON.stringify(info), this.httpOptions);

  }
  updateLeaveDisplayName(info:any): Observable<any> {
      info.companyName=this.companyName;
    return this.hClient.post(this.url + 'api/updateLeaveDisplayName', JSON.stringify(info), this.httpOptions);

  }

    getLeaveDetails(tableName:any,status:any, page:any, size:any): Observable<any> {
        return this.hClient.get(this.url + 'api/getMastertable/' + tableName + '/' + status + '/' + page + '/' + size+'/' + this.companyName, this.httpOptions);
    }

    setNewLeaveType(info:any): Observable<any> {
        return this.hClient.post(this.url + 'api/setNewLeaveType', JSON.stringify(info), this.httpOptions);
    }

    getLeavesTypeInfo(): Observable<any> {
        return this.hClient.get(this.url + 'api/getLeavesTypeInfo/'+this.companyName, this.httpOptions);

    }
    setToggleLeaveType(info:any): Observable<any> {
      info.companyName= this.companyName;
        return this.hClient.post(this.url + 'api/setToggleLeaveType', JSON.stringify(info), this.httpOptions);
    }
    getCarryforwardedLeaveMaxCount(leaveId:any): Observable<any> {
      return this.hClient.get(this.url + 'api/getCarryforwardedLeaveMaxCount/'+leaveId+'/'+this.companyName, this.httpOptions);

    }

}
