import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class CompanySettingService {
    httpOptions = {
      headers: new HttpHeaders({ 'content-Type': 'application/json' })
    };    
    constructor(private hClient: HttpClient) {}
    url:any = 'http://localhost:6060';
  setDesignation(info:any): Observable<any>{
    return this.hClient.post(this.url+'/api/setDesignation',  JSON.stringify(info), this.httpOptions);
  }
  getDesignation(tableName:any,status:any,page:any,size:any,companyName:any): Observable<any>{
    return this.hClient.get(this.url+'/api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
  }
  setDepartments(info:any): Observable<any>{
    return this.hClient.post(this.url+'/api/setDepartments', JSON.stringify(info), this.httpOptions);
  }
  getDepartments(tableName:any,status:any,page:any,size:any,companyName:any): Observable<any>{
    return this.hClient.get(this.url+'/api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
  }
  putDepartments(info:any):Observable<any>{
    return this.hClient.put(this.url+'/api/putDepartments', JSON.stringify(info), this.httpOptions);
  }
  putDesignation(info:any):Observable<any>{
    return this.hClient.put(this.url+'/api/putDesignation', JSON.stringify(info), this.httpOptions);
  }
  updateStatus(info:any): Observable<any>{
    return this.hClient.post(this.url+'/api/updateStatus', JSON.stringify(info), this.httpOptions);
  }
  designationstatus(info:any): Observable<any>{
    return this.hClient.post(this.url+'/api/designationstatus', JSON.stringify(info), this.httpOptions);
  }
  getErrorMessages(errorCode:any,page:any, size:any): Observable<any> {
    return this.hClient.get('http://localhost:6060/api/getErrorMessages/' + errorCode + '/' + page + '/' + size, this.httpOptions);
  }
}    