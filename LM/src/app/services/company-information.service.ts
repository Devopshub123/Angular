import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class CompanyInformationService {
  companyId:any
  httpOptions = {
    headers: new HttpHeaders({ 'content-Type': 'application/json' })
  };
  url:any = "http://localhost:6060";
  constructor(private hClient: HttpClient) { }

  setCompanyInformation(info: any):Observable<any>{
    console.log("hellohsdkhcbhdb",info)
    return this.hClient.post(this.url+'/api/setCompanyInformation', JSON.stringify(info), this.httpOptions);
  }
  getCompanyInformation(tableName: string,status: null,page: string | number,size: string | number,companyName: string):Observable<any>{
    return this.hClient.get(this.url+'/api/getMastertable/'+tableName+'/'+null+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
  }
  putCompanyInformation(info: any):Observable<any>{
    return this.hClient.put(this.url+'/api/putCompanyInformation', JSON.stringify(info), this.httpOptions);
  }
  setUploadImage(data: FormData,Id: number): Observable<any> {
    var conpanyName ='Apple'
    return this.hClient.post(this.url+'/api/setUploadImage/'+conpanyName, data);
  }
  getUploadImage(id: any,companyName:any): Observable<any> {
    // var conpanyName ='Apple'
    return this.hClient.get(this.url+'/api/getImage/' + id+'/'+companyName);
  }
  removeImage(id: any,companyName:any): Observable<any> {
    return this.hClient.delete(this.url+'/api/removeImage/' + id+'/'+companyName,this.httpOptions);
  }

}
