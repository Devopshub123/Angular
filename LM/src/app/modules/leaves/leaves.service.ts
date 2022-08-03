import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class LeavesService {
  mainUrl = environment.apiUrl;
  userSession: any;
  httpOptions = {
    headers: new HttpHeaders({'content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {
  }

  getLeavesForApprovals(id: any): any {
    return this.http.get(this.mainUrl + 'api/getLeavesForApprovals/' + id, this.httpOptions);
  }

  setApproveOrReject(data: any): any {
    console.log("hheheh", data)
    return this.http.post(this.mainUrl + 'api/setLeaveStatus', data, this.httpOptions);
  }

  getErrorMessages(errorCode: any, page: any, size: any): Observable<any> {
    return this.http.get(this.mainUrl + 'api/getErrorMessages/' + errorCode + '/' + page + '/' + size, this.httpOptions);
  }


  getCompoffForApprovals(id: any): any {
    return this.http.get(this.mainUrl + 'api/getCompoffsForApproval/' + id, this.httpOptions);
  }

  setCompoffForApproveOrReject(data: any): any {
    console.log("hheheh", data)
    return this.http.post(this.mainUrl + 'api/setCompoffForApproveOrReject', data, this.httpOptions);
  }

  getHandledLeaves(id: any): any {
    return this.http.get(this.mainUrl + 'api/getHandledLeaves/' + id, this.httpOptions);
  }

  getCompoffs(data: any): any {
    return this.http.post(this.mainUrl + 'api/getCompoffs', data, this.httpOptions);
  }

  getMastertable(data: any): Observable<any> {
    return this.http.post(this.mainUrl + 'api/getMastertables', data, this.httpOptions);
  }

  getEmployeesForReportingManager(data: any): Observable<any> {
    return this.http.post(this.mainUrl + 'api/getEmployeesForReportingManager', data, this.httpOptions);
  }

  getEmployeeLeaveDetailedReportForManager(data: any): Observable<any> {
    return this.http.post(this.mainUrl + 'api/getEmployeeLeaveDetailedReportForManager', data, this.httpOptions);
  }

  getSummaryReportForManager(data: any): Observable<any> {
    return this.http.post(this.mainUrl + 'api/getSummaryReportForManager', data, this.httpOptions);
  }

  getYearsForReport(): Observable<any> {
    return this.http.get(this.mainUrl + 'api/getYearsForReport', this.httpOptions);
  }

  /**Get Leave History */
  getleavehistory(empid: any, page: any, size: any): Observable<any> {
    return this.http.get(this.mainUrl + 'api/getemployeeleaves/' + empid + '/' + page + '/' + size, this.httpOptions);
  }

  /**Leave Balance */
  getLeaveBalance(empid: any): Observable<any> {
    return this.http.get(this.mainUrl + 'api/getLeaveBalance/' + empid, this.httpOptions);
  }
getCompOff(employeeId:any,rmid:any): Observable<any>{
    return this.http.get(this.mainUrl+'api/getCompOff/'+employeeId+'/'+rmid, this.httpOptions);
  }

setCompOff(info:any): Observable<any> {
  return this.http.post(this.mainUrl+'api/setCompOff', JSON.stringify(info), this.httpOptions);
}

getCompOffMinWorkingHours(): Observable<any>{
  return this.http.get(this.mainUrl+'api/getCompOffMinWorkingHours', this.httpOptions);

}
getCompoffCalender(info:any): Observable<any>{
  console.log(info,'info')
  return this.http.get(this.mainUrl+'api/getCompoffCalender/'+JSON.stringify(info), this.httpOptions);
}
setCompOffReviewApprove(info:any): Observable<any> {
  return this.http.post(this.mainUrl+'api/setCompOffReviewApprove', JSON.stringify(info), this.httpOptions);
}
getuserleavecalender(id:any):Observable<any>{
  return this.http.post(this.mainUrl+'api/getleavecalender/'+id, this.httpOptions);

}

getDurationforBackdatedCompoffLeave(info:any): Observable<any>{
  return this.http.get(this.mainUrl+'api/getDurationforBackdatedCompoffLeave', this.httpOptions);

}
  getLeaveCalendarForManager(Id:any): Observable<any> {
    return this.http.get(this.mainUrl+'api/getLeaveCalendarForManager/'+Id, this.httpOptions);
  }

    setDeleteLeaveRequest(info: any): Observable<any> {
      return this.http.post(this.mainUrl + 'api/setDeleteLeaveRequest', JSON.stringify(info), this.httpOptions);
    }

    cancelLeaveRequest(info: any): Observable<any> {
      return this.http.post(this.mainUrl + 'api/cancelLeaveRequest', JSON.stringify(info), this.httpOptions);

    }

    SetEditProfile(info: any): Observable<any> {
      return this.http.post(this.mainUrl + 'api/editProfile', info, this.httpOptions);

    }

    getStates(id: any): Observable<any> {
      return this.http.get(this.mainUrl + 'api/getStatesPerCountry/' + id, this.httpOptions)
    }

    getCities(id: any): Observable<any> {
      return this.http.get(this.mainUrl + 'api/getCitiesPerCountry/' + id, this.httpOptions)
    }
    getProfileImage(id: any,companyName:any): Observable<any> {
      // var conpanyName ='Apple'
      return this.http.get(this.mainUrl + 'api/getProfileImage/' + id+'/'+companyName);
    }

    getLeavesForCancellation(id: any): Observable<any>  {
      return this.http.get(this.mainUrl + 'api/getLeavesForCancellation/' + id, this.httpOptions);
    }


    getEmployeeInformation(id: any): Observable<any> {
      return this.http.get(this.mainUrl + 'api/getEmployeeInformation/' + id, this.httpOptions);
    }
    setProfileImage(data: FormData,Id: number ,conpanyName:any): Observable<any> {
      return this.http.post(this.mainUrl + 'api/setProfileImage/'+conpanyName+'/'+Id, data);
    }
    removeProfileImage(id: any,companyName:any): Observable<any> {
      return this.http.delete(this.mainUrl + 'api/removeProfileImage/' + id+'/'+companyName,this.httpOptions);
    }
    getHolidaysList(empId:any): Observable<any>{
      return this.http.get(this.mainUrl+'api/getHolidaysList/' + empId, this.httpOptions);
    }
    getHolidays(year:any,location:any,page:any,size:any): Observable<any>{
      console.log(year,location,page,size)
      return this.http.get(this.mainUrl+'api/getHolidaysFilter/'+ year+'/'+location+'/'+page+'/'+size, this.httpOptions);
    }

    getLeavesTypeInfo(): Observable<any> {
      return this.http.get(this.mainUrl + 'api/getLeavesTypeInfo', this.httpOptions);

    }
    getDaysToBeDisabledFromDate(id:any,leaveId:any): Promise<any> {
      return this.http.get(this.mainUrl + 'api/getdaystobedisabledfromdate/'+id+'/'+leaveId, this.httpOptions).toPromise();;

    }
    getDaysToBeDisabledToDate(id:any,leaveId:any): Promise<any> {
      return this.http.get(this.mainUrl + 'api/getdaystobedisabledtodate/'+id+'/'+leaveId,  this.httpOptions).toPromise();;

    }
    setValidateLeave(info:any): Observable<any> {
      return this.http.post(this.mainUrl + 'api/validateleave', JSON.stringify(info), this.httpOptions);
    }

    setUploadDocument(data:File,empid:any,companyname:any){
      // let companyname = 'sreeb';
      // let empid = 188
      return this.http.post(this.mainUrl+'api/setLeaveDocument/'+companyname+'/'+empid,data);
    }
    setEmployeeLeave(info:any): Observable<any> {
      return this.http.post(this.mainUrl + 'api/setemployeeleave', JSON.stringify(info), this.httpOptions);
    }

}
