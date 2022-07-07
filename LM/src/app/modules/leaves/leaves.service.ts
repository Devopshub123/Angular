import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LeavesService {
  mainUrl= environment.apiUrl;
  userSession: any;
  httpOptions = {
    headers: new HttpHeaders({'content-Type': 'application/json'})
  };
  constructor(private http: HttpClient) { }

  getLeavesForApprovals(id:any): any{
    return this.http.get(this.mainUrl + 'api/getLeavesForApprovals/'+id,this.httpOptions);
  }

}
