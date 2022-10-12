import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  mainBeUrl= environment.apiUrl;
  userSession: any;
  httpOptions = {
    headers: new HttpHeaders({'content-Type': 'application/json'})
  };  
  constructor(private http: HttpClient) { }
////// get country list
getCountry(tableName:any,status:any,page:any,size:any,companyName:any):Observable<any>{
  return this.http.get(this.mainBeUrl + 'api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
}
//// get state list by country id
getStates(id:any):Observable<any>{
  return this.http.get(this.mainBeUrl + 'api/getStates/'+id , this.httpOptions)
}
////// get citys list
getCities(id:any):Observable<any>{
  return this.http.get(this.mainBeUrl + 'api/getCities/'+id,this.httpOptions)
}
}
