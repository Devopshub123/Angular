import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/index";
@Injectable({
    providedIn: 'root'
})
export class RoleMasterService {
    httpOptions = {
        headers: new HttpHeaders({ 'content-Type': 'application/json' })
    };

    constructor(private hClient: HttpClient) { }
    url: any = "http://localhost:6060";
    getRoleMaster(){
        return this.hClient.get(this.url+'/api/getrolemaster', this.httpOptions);
    }
    getScreenMaster(){
        return this.hClient.get(this.url+'/api/getscreensmaster', this.httpOptions);
    }
    getFunctionalitesMaster(){
        return this.hClient.get(this.url+'/api/getfunctionalitiesmaster', this.httpOptions);
    }
    getScreenFunctionalities() {
        return this.hClient.get(this.url + '/api/getscreenfunctionalitiesmaster', this.httpOptions);
    }
    getRoleScreenFunctionalities(roleId: Observable<any>) {

        return this.hClient.get(this.url + '/api/getrolescreenfunctionalities/' + roleId, this.httpOptions);

    }
    setRoleMaster(info: any): Observable<any> {
        return this.hClient.post(this.url + '/api/setRoleMaster', JSON.stringify(info), this.httpOptions);
    }
    setRoleAccess(info: {}): Observable<any> {
        return this.hClient.post(this.url + '/api/setRoleAccess', JSON.stringify(info), this.httpOptions);
    }
}
