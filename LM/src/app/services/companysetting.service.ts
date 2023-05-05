import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class CompanySettingService {
    httpOptions:any;
    companyName:any;
    constructor(private hClient: HttpClient) {
      this.companyName = sessionStorage.getItem('companyName')?sessionStorage.getItem('companyName'):null;
      this.httpOptions = {
        headers: new HttpHeaders({
          'content-Type': 'application/json',
          "Authorization": JSON.parse(JSON.stringify(sessionStorage.getItem('token') || '')),
        })
      };
    }
    mainBeUrl= environment.apiUrl;
    validatePrefix(info:any): Observable<any> {
      return this.hClient.post(this.mainBeUrl + 'api/validatePrefix', JSON.stringify(info), this.httpOptions);
    }
    setWorkLocation(info:any): Observable<any> {
      info.companyName = this.companyName;
      return this.hClient.post(this.mainBeUrl + 'api/setWorkLocation', JSON.stringify(info), this.httpOptions);
    }
    getWorkLocation(info:any): Observable<any>{
      this.httpOptions = {
        headers: new HttpHeaders({
          'content-Type': 'application/json',
          "Authorization": JSON.parse(JSON.stringify(sessionStorage.getItem('token') || '')),
        })
      };
      info.companyName = this.companyName;
      return this.hClient.post(this.mainBeUrl + 'api/getWorkLocation',JSON.stringify(info), this.httpOptions);
    }
    getactiveWorkLocation(info:any): Observable<any>{
      info.companyName=this.companyName;
      return this.hClient.post(this.mainBeUrl + 'api/getactiveWorkLocation',JSON.stringify(info), this.httpOptions);
    }
    getReportingManagers(data:any):Observable<any>{
      data.companyName=this.companyName;
      return this.hClient.post(this.mainBeUrl + 'api/getReportingManager',JSON.stringify(data), this.httpOptions)

    }
    getMastertable(tableName:any,status:any,page:any,size:any,companyName:any):Observable<any>{
      return this.hClient.get(this.mainBeUrl + 'api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+this.companyName, this.httpOptions);
    }
  getCountry(tableName: any, status: any, page: any, size: any, companyName: any): Observable<any>{
      this.companyName = sessionStorage.getItem('companyName')?sessionStorage.getItem('companyName'):null;
    return this.hClient.get(this.mainBeUrl + 'api/getMastertable/' + tableName + '/' + status + '/' + page + '/' + size + '/' + this.companyName, this.httpOptions);
    }
    getStates(tableName:any,page:any,size:any,companyName:any):Observable<any>{
      return this.hClient.get(this.mainBeUrl + 'api/getMastertable/'+tableName+'/'+page+'/'+size+'/'+this.companyName, this.httpOptions);
    }
    getStatesc(id:any):Observable<any>{
      return this.hClient.get(this.mainBeUrl + 'api/getStates/'+id+'/'+this.companyName,this.httpOptions)
    }
    getCities(id:any):Observable<any>{
      return this.hClient.get(this.mainBeUrl + 'api/getCities/'+id+'/'+this.companyName,this.httpOptions)
    }
    setWorkStatus(info:any){
      return this.hClient.post(this.mainBeUrl + 'api/setWorkStatus', JSON.stringify(info), this.httpOptions);
    }
    setDesignation(info:any): Observable<any>{
      info.companyName = this.companyName;
      return this.hClient.post(this.mainBeUrl + 'api/setDesignation',  JSON.stringify(info), this.httpOptions);
    }
  getDesignation(tableName:any,status:any,page:any,size:any,companyName:any): Observable<any>{
    return this.hClient.get(this.mainBeUrl + 'api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+this.companyName, this.httpOptions);
  }
  setDepartments(info: any): Observable<any>{
    info.companyName= this.companyName;
    return this.hClient.post(this.mainBeUrl + 'api/setDepartments', JSON.stringify(info), this.httpOptions);
  }
  getDepartments(tableName:any,status:any,page:any,size:any,companyName:any): Observable<any>{
    return this.hClient.get(this.mainBeUrl + 'api/getMastertable/' + tableName + '/' + status + '/' + page + '/' + size + '/' + this.companyName, this.httpOptions);
  }
  putDepartments(info:any):Observable<any>{
      info.companyName=this.companyName;
    return this.hClient.put(this.mainBeUrl + 'api/putDepartments', JSON.stringify(info), this.httpOptions);
  }
  putDesignation(info:any):Observable<any>{
      info.companyName=this.companyName;
    return this.hClient.put(this.mainBeUrl + 'api/putDesignation', JSON.stringify(info), this.httpOptions);
  }
  updateStatus(info:any): Observable<any>{
      info.companyName = this.companyName;
    return this.hClient.post(this.mainBeUrl + 'api/updateStatus', JSON.stringify(info), this.httpOptions);
  }
  updateStatusall(info:any): Observable<any>{
    info.companyName = this.companyName;
    return this.hClient.post(this.mainBeUrl + 'api/updateStatusall', JSON.stringify(info), this.httpOptions);
  }
  designationstatus(info:any): Observable<any>{
      info.companyName= this.companyName;
    return this.hClient.post(this.mainBeUrl + 'api/designationstatus', JSON.stringify(info), this.httpOptions);
  }
  getErrorMessages(errorCode:any,page:any, size:any): Observable<any> {
    return this.hClient.get(this.mainBeUrl +'api/getErrorMessages/' + errorCode + '/' + page + '/' + size+'/'+this.companyName, this.httpOptions);
  }

  setCompanyInformation(info: any):Observable<any>{
    info.companyName= this.companyName;
    return this.hClient.post(this.mainBeUrl + 'api/setCompanyInformation', JSON.stringify(info), this.httpOptions);
  }
  getCompanyInformation(tableName: string,status: null,page: string | number,size: string | number,companyName: string):Observable<any>{
    return this.hClient.get(this.mainBeUrl + 'api/getMastertable/'+tableName+'/'+null+'/'+page+'/'+size+'/'+this.companyName, this.httpOptions);
  }
  putCompanyInformation(info: any):Observable<any>{
      info.companyName = this.companyName;
    return this.hClient.put(this.mainBeUrl + 'api/putCompanyInformation', JSON.stringify(info), this.httpOptions);
  }
  setUploadImage(data: FormData,Id: number): Observable<any> {
    var conpanyName ='Apple'
    return this.hClient.post(this.mainBeUrl + 'api/setUploadImage/'+conpanyName, data);
  }
  getUploadImage(id: any,companyName:any): Observable<any> {
    // var conpanyName ='Apple'
    return this.hClient.get(this.mainBeUrl + 'api/getImage/' + id+'/'+companyName);
  }
  removeImage(info:any): Observable<any> {
    return this.hClient.delete(this.mainBeUrl + 'api/removeImage/'+encodeURI(info));
  }
  setHolidays(info: any): Observable<any>{
    info.companyName = this.companyName;
    return this.hClient.post(this.mainBeUrl+'api/setHolidaysMaster', JSON.stringify(info), this.httpOptions);
  }
  // setHolidays(info:any,companyName:any):Observable<any>{
  //     info[0].companyName= this.companyName;

  //   return this.hClient.post(this.mainBeUrl+'api/setHolidays', JSON.stringify(info), this.httpOptions);
  // }

  setHolidayStatus(info:any){
    return this.hClient.post(this.mainBeUrl+'api/setHolidayStatus', JSON.stringify(info), this.httpOptions);
  }
  putHolidays(info:any,companyName:any):Observable<any>{
      info.companyName = this.companyName;
    return this.hClient.put(this.mainBeUrl+'api/putHolidays', JSON.stringify(info), this.httpOptions);

  }
  getLocation(tableName:any,status:any,page:any,size:any,companyName:any):Observable<any>{
    return this.hClient.get(this.mainBeUrl+'api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+this.companyName, this.httpOptions);
  }
  deleteHoliday(holidayId:any):Observable<any>{
    return this.hClient.delete(this.mainBeUrl+'api/deleteHoliday/'+holidayId+'/'+this.companyName, this.httpOptions);

  }
  getHolidaysYearsOrLocation(columnName:any):Observable<any>{
    return this.hClient.get(this.mainBeUrl+'api/getHolidaysYears/'+columnName, this.httpOptions);

  }
  getHolidays(year: any, locationId: any, page: any, size: any): Observable<any>{
    return this.hClient.get(this.mainBeUrl+'api/getHolidaysFilter/'+year+'/'+locationId+'/'+page+'/'+size+'/'+this.companyName, this.httpOptions);
  }
  getstatuslists(){
    return this.hClient.get(this.mainBeUrl+'admin/api/getstatuslist/'+this.companyName, this.httpOptions)
  }
  getPreonboardingMastertable(tableName: any, status: any, page: any, size: any, companyName: any): Observable<any>{
    return this.hClient.get(this.mainBeUrl + 'api/getMastertablePreonboarding/'+tableName+'/'+status+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
  }
  getPreonboardingStatesc(id: any, cname: any): Observable<any>{
    return this.hClient.get(this.mainBeUrl + 'api/getStates/'+id+'/'+cname,this.httpOptions)
  }
  getPreonboardingCities(id:any,cname: any):Observable<any>{
    return this.hClient.get(this.mainBeUrl + 'api/getCities/'+id+'/'+cname,this.httpOptions)
  }
  getPreonboardingCountry(tableName: any, status: any, page: any, size: any, companyName: any): Observable<any>{
     return this.hClient.get(this.mainBeUrl + 'api/getMastertablePreonboarding/'+tableName+'/'+status+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
  }
  getClientSubscriptionDetails() {
    this.companyName = sessionStorage.getItem('companyName')?sessionStorage.getItem('companyName'):null
    return this.hClient.get(this.mainBeUrl +'subscription/api/getClientSubscriptionDetails/'+this.companyName , this.httpOptions);

  }
  getActiveEmployeesCount(){
    this.companyName = sessionStorage.getItem('companyName')?sessionStorage.getItem('companyName'):null
    return this.hClient.get(this.mainBeUrl +'api/getActiveEmployeesCount/'+this.companyName , this.httpOptions);

  }
  // /api/getActiveEmployeesCount/:companyName

}
