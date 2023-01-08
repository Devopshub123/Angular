import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from "rxjs";
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CompanyInformationService {
  companyId:any
  companyName:any;
  httpOptions = {
    headers: new HttpHeaders({ 'content-Type': 'application/json' })
  };
  mainBeUrl= environment.apiUrl;
  constructor(private hClient: HttpClient) {
    this.companyName = sessionStorage.getItem('companyName')
  }

  setCompanyInformation(info: any):Observable<any>{
    return this.hClient.post(this.mainBeUrl + 'api/setCompanyInformation', JSON.stringify(info), this.httpOptions);
  }
  getCompanyInformation(tableName: string,status: null,page: string | number,size: string | number,companyName: string):Observable<any>{
    return this.hClient.get(this.mainBeUrl + 'api/getMastertable/'+tableName+'/'+null+'/'+page+'/'+size+'/'+this.companyName, this.httpOptions);
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

}
