import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class AdminService {
  mainUrl= environment.apiUrl;
  userSession: any;
  httpOptions = {
    headers: new HttpHeaders({'content-Type': 'application/json'})
  };  
 
  constructor(private http: HttpClient) {
  }
  setWorkLocation(info:any): Observable<any> {
    console.log(info)
    return this.http.post(this.mainUrl + 'api/setWorkLocation', JSON.stringify(info), this.httpOptions);
  }
  getWorkLocation(info:any): Observable<any>{
    return this.http.post(this.mainUrl + 'api/getWorkLocation',JSON.stringify(info), this.httpOptions);
  }
  
  getactiveWorkLocation(info:any): Observable<any>{
    return this.http.post(this.mainUrl + 'api/getactiveWorkLocation',JSON.stringify(info), this.httpOptions);
  }
  setHolidays(info:any,companyName:any):Observable<any>{
    return this.http.post(this.mainUrl+'api/setHolidays/'+companyName, JSON.stringify(info), this.httpOptions);
  }

  setHolidayStatus(info:any){
    return this.http.post(this.mainUrl+'api/setHolidayStatus', JSON.stringify(info), this.httpOptions);
  }
  putHolidays(info:any,companyName:any):Observable<any>{
    return this.http.put(this.mainUrl+'api/putHolidays/'+companyName, JSON.stringify(info), this.httpOptions);

  }
  getMastertable(tableName:any,status:any,page:any,size:any,companyName:any):Observable<any>{
    return this.http.get(this.mainUrl+'api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
  }
  deleteHoliday(holidayId:any):Observable<any>{
    return this.http.delete(this.mainUrl+'api/deleteHoliday/'+holidayId, this.httpOptions);

  }
  getHolidaysYearsOrLocation(columnName:any):Observable<any>{
    return this.http.get(this.mainUrl+'api/getHolidaysYears/'+columnName, this.httpOptions);

  }
  getHolidays(year:any,locationId:any,page:any,size:any):Observable<any>{
    return this.http.get(this.mainUrl+'api/getHolidysFilter/'+year+'/'+locationId+'/'+page+'/'+size, this.httpOptions);
  }
  getErrorMessages(errorCode:any,page:any, size:any): Observable<any> {
    return this.http.get(this.mainUrl + 'api/getErrorMessages/' + errorCode + '/' + page + '/' + size, this.httpOptions);
}
setErrorMessages(info:any): Observable<any> {
    return this.http.post(this.mainUrl + 'api/setErrorMessages', JSON.stringify(info), this.httpOptions);
}

setIntegrationEmpidsLookup(data:any): Observable<any> {
  return this.http.post(this.mainUrl + 'admin/api/setIntegrationEmpidsLookup', data, this.httpOptions);
}
getIntegrationEmpidsLookup(data:any): Observable<any> {
  return this.http.post(this.mainUrl + 'admin/api/getIntegrationEmpidsLookup', data, this.httpOptions);
}
setShiftMaster(data:any):Observable<any>{
  return this.http.post(this.mainUrl+ 'admin/api/setShiftMaster',data,this.httpOptions);
}
getAllShifts(): Observable<any>{
  return this.http.get(this.mainUrl + 'admin/api/getAllShifts', this.httpOptions);
}
getShiftsDetailsById(shift_id:any): Observable<any>{
  return this.http.get(this.mainUrl + 'admin/api/getShiftsDetailsById/'+shift_id, this.httpOptions);
}
getActiveShiftIds(): Observable<any>{
  return this.http.get(this.mainUrl + 'admin/api/getActiveShiftIds', this.httpOptions);
}
updateShiftStatus(data:any):Observable<any>{
  return this.http.post(this.mainUrl+'admin/api/updateShiftStatus',data,this.httpOptions);
  }
  //// get messages list
  getMessagesListApi(data:any){
    return this.http.post(this.mainUrl+'admin/api/getAttendenceMessages', JSON.stringify(data), this.httpOptions);
  }
  //// update messages data
  updateMessagesData(data:any){
    return this.http.post(this.mainUrl+'admin/api/setAttendenceMessages', JSON.stringify(data), this.httpOptions);
  }
  getRolesByDepartment(data:any):Observable<any>{
    return this.http.post(this.mainUrl+'admin/api/getRolesByDepartment',data,this.httpOptions);
  }
}
