import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/index";
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class UserDashboardService {
    mainBeUrl= environment.apiUrl;
    httpOptions = {
        headers: new HttpHeaders({ 'content-Type': 'application/json' })
    };

    constructor(private hClient: HttpClient) { }
    url: any = "http://localhost:6060";
    getHolidaysList(empId: string): Observable<any>{
        return this.hClient.get(this.mainBeUrl + 'api/getHolidaysList/' + empId, this.httpOptions);
    }
    getEmployeeLeaveBalance(empId: string | number): Observable<any>{
        return this.hClient.get(this.mainBeUrl + 'api/getemployeeleavebalance/' + empId, this.httpOptions);
    }
    getEmployeeRoles(empId: string): Observable<any>{
        return this.hClient.get(this.mainBeUrl + 'api/getemployeeroles/' + empId, this.httpOptions);
    }
    getleavehistory() :Observable<any>{
        console.log("ghjg")
        return this.hClient.get(this.mainBeUrl + 'api/getemployeeleaves', this.httpOptions);
    }
}
