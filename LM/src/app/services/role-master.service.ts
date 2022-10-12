import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/index";
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class RoleMasterService {
    mainBeUrl= environment.apiUrl;
    httpOptions = {
        headers: new HttpHeaders({ 'content-Type': 'application/json' })
    };

    constructor(private hClient: HttpClient) { }

    getRoleMaster(){
        return this.hClient.get(this.mainBeUrl + 'api/getrolemaster', this.httpOptions);
    }
    getScreenMaster(){
        return this.hClient.get(this.mainBeUrl + 'api/getscreensmaster', this.httpOptions);
    }
    getFunctionalitesMaster(){
        return this.hClient.get(this.mainBeUrl + 'api/getfunctionalitiesmaster', this.httpOptions);
    }
    getScreenFunctionalities() {
        return this.hClient.get(this.mainBeUrl + 'api/getscreenfunctionalitiesmaster', this.httpOptions);
    }
    getRoleScreenFunctionalities(roleId: Observable<any>) {

        return this.hClient.get(this.mainBeUrl + 'api/getrolescreenfunctionalities/' + roleId, this.httpOptions);

    }
    setRoleMaster(info: any): Observable<any> {
        return this.hClient.post(this.mainBeUrl + 'api/setRoleMaster', JSON.stringify(info), this.httpOptions);
    }
    setRoleAccess(info: any): Observable<any> {
        return this.hClient.post(this.mainBeUrl + 'api/setRoleAccess', JSON.stringify(info), this.httpOptions);
    }

}
