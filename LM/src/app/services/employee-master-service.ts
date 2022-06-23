import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from '../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class EmployeeMasterService {
  httpOptions = {
    headers: new HttpHeaders({ 'content-Type': 'application/json' })
  };

  constructor(private hClient: HttpClient) { }
  url:any = environment.apiUrl;
  setEmployeeMaster(info:any):Observable<any>{
    return this.hClient.post(this.url+'/api/setEmployeeMaster', JSON.stringify(info), this.httpOptions);
  }
  getEmployeeMaster(info:any):Observable<any>{
    return this.hClient.post(this.url+'/api/getEmployeeMaster', JSON.stringify(info), this.httpOptions);
  }
  putEmployeeMaster(info:any){
    return this.hClient.put(this.url+'/api/putEmployeeMaster/', JSON.stringify(info),this.httpOptions);

  }
  getSearch(employeeName:any,employeeId:any){
    return this.hClient.put(this.url+'/api/getSearch/'+employeeName+'/'+employeeId, this.httpOptions);
  }

  getValidateExistingDetails(info:any):Observable<any>{
    return this.hClient.post(this.url+'/api/getValidateExistingDetails',JSON.stringify(info),this.httpOptions);
  }
}
