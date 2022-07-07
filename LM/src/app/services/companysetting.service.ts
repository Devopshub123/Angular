import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class CompanySettingService {
    httpOptions = {
      headers: new HttpHeaders({ 'content-Type': 'application/json' })
    };    
    constructor(private hClient: HttpClient) {}
    mainBeUrl= environment.apiUrl;
    validatePrefix(info:any): Observable<any> {
      return this.hClient.post(this.mainBeUrl + 'api/validatePrefix', JSON.stringify(info), this.httpOptions);
    }
    setWorkLocation(info:any): Observable<any> {
      console.log(info)
      return this.hClient.post(this.mainBeUrl + 'api/setWorkLocation', JSON.stringify(info), this.httpOptions);
    }
    getWorkLocation(info:any): Observable<any>{
      return this.hClient.post(this.mainBeUrl + 'api/getWorkLocation',JSON.stringify(info), this.httpOptions);
    }
    getactiveWorkLocation(info:any): Observable<any>{
      return this.hClient.post(this.mainBeUrl + 'api/getactiveWorkLocation',JSON.stringify(info), this.httpOptions);
    }
    getReportingManagers(id:any):Observable<any>{
      return this.hClient.post(this.mainBeUrl + 'api/getReportingManager',JSON.stringify(id), this.httpOptions)
  
    }
    getMastertable(tableName:any,status:any,page:any,size:any,companyName:any):Observable<any>{
      return this.hClient.get(this.mainBeUrl + 'attendance/api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
    }
    getCountry(tableName:any,status:any,page:any,size:any,companyName:any):Observable<any>{
      return this.hClient.get(this.mainBeUrl + 'api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
    }
    getStates(tableName:any,page:any,size:any,companyName:any):Observable<any>{
      return this.hClient.get(this.mainBeUrl + 'api/getMastertable/'+tableName+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
    }
    getStatesc(id:any):Observable<any>{
      return this.hClient.get(this.mainBeUrl + 'api/getStates/'+id,this.httpOptions)
    }
    getCities(id:any):Observable<any>{
      return this.hClient.get(this.mainBeUrl + 'api/getCities/'+id,this.httpOptions)
    }
    setWorkStatus(info:any){
      return this.hClient.post(this.mainBeUrl + 'api/setWorkStatus', JSON.stringify(info), this.httpOptions);
    }  
  setDesignation(info:any): Observable<any>{
    return this.hClient.post(this.mainBeUrl + 'attendance/api/setDesignation',  JSON.stringify(info), this.httpOptions);
  }
  getDesignation(tableName:any,status:any,page:any,size:any,companyName:any): Observable<any>{
    return this.hClient.get(this.mainBeUrl + 'attendance/api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
  }
  setDepartments(info:any): Observable<any>{
    return this.hClient.post(this.mainBeUrl + 'api/setDepartments', JSON.stringify(info), this.httpOptions);
  }
  getDepartments(tableName:any,status:any,page:any,size:any,companyName:any): Observable<any>{
    return this.hClient.get(this.mainBeUrl + 'api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
  }
  putDepartments(info:any):Observable<any>{
    return this.hClient.put(this.mainBeUrl + 'api/putDepartments', JSON.stringify(info), this.httpOptions);
  }
  putDesignation(info:any):Observable<any>{
    return this.hClient.put(this.mainBeUrl + 'api/putDesignation', JSON.stringify(info), this.httpOptions);
  }
  updateStatus(info:any): Observable<any>{
    return this.hClient.post(this.mainBeUrl + 'api/updateStatus', JSON.stringify(info), this.httpOptions);
  }
  updateStatusall(info:any): Observable<any>{
    console.log(info)
    return this.hClient.post(this.mainBeUrl + 'api/updateStatusall', JSON.stringify(info), this.httpOptions);
  }
  designationstatus(info:any): Observable<any>{
    return this.hClient.post(this.mainBeUrl + 'api/designationstatus', JSON.stringify(info), this.httpOptions);
  }
  getErrorMessages(errorCode:any,page:any, size:any): Observable<any> {
    return this.hClient.get(this.mainBeUrl +'api/getErrorMessages/' + errorCode + '/' + page + '/' + size, this.httpOptions);
  }
  
  setCompanyInformation(info: any):Observable<any>{
    return this.hClient.post(this.mainBeUrl + 'api/setCompanyInformation', JSON.stringify(info), this.httpOptions);
  }
  getCompanyInformation(tableName: string,status: null,page: string | number,size: string | number,companyName: string):Observable<any>{
    return this.hClient.get(this.mainBeUrl + 'api/getMastertable/'+tableName+'/'+null+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
  }
  putCompanyInformation(info: any):Observable<any>{
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
  removeImage(id: any,companyName:any): Observable<any> {
    return this.hClient.delete(this.mainBeUrl + 'api/removeImage/' + id+'/'+companyName,this.httpOptions);
  }
  

  setHolidays(info:any,companyName:any):Observable<any>{
    return this.hClient.post(this.mainBeUrl+'api/setHolidays/'+companyName, JSON.stringify(info), this.httpOptions);
  }

  setHolidayStatus(info:any){
    return this.hClient.post(this.mainBeUrl+'api/setHolidayStatus', JSON.stringify(info), this.httpOptions);
  }
  putHolidays(info:any,companyName:any):Observable<any>{
    return this.hClient.put(this.mainBeUrl+'api/putHolidays/'+companyName, JSON.stringify(info), this.httpOptions);

  }
  getLocation(tableName:any,status:any,page:any,size:any,companyName:any):Observable<any>{
    return this.hClient.get(this.mainBeUrl+'api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
  }
  deleteHoliday(holidayId:any):Observable<any>{
    return this.hClient.delete(this.mainBeUrl+'api/deleteHoliday/'+holidayId, this.httpOptions);

  }
  getHolidaysYearsOrLocation(columnName:any):Observable<any>{
    return this.hClient.get(this.mainBeUrl+'api/getHolidaysYears/'+columnName, this.httpOptions);

  }
  getHolidays(year:any,locationId:any,page:any,size:any):Observable<any>{
    return this.hClient.get(this.mainBeUrl+'api/getHolidysFilter/'+year+'/'+locationId+'/'+page+'/'+size, this.httpOptions);
  }
  

}
  