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
    companyName:any;
    constructor(private hClient: HttpClient) {
      this.companyName=sessionStorage.getItem("companyName");
    }

    getRoleMaster(){
        return this.hClient.get(this.mainBeUrl + 'api/getrolemaster/'+this.companyName, this.httpOptions);
    }
    getScreenMaster(){
        return this.hClient.get(this.mainBeUrl + 'api/getscreensmaster/'+this.companyName, this.httpOptions);
    }
    getFunctionalitesMaster(){
        return this.hClient.get(this.mainBeUrl + 'api/getfunctionalitiesmaster/'+this.companyName, this.httpOptions);
    }
    getScreenFunctionalities() {
        return this.hClient.get(this.mainBeUrl + 'api/getscreenfunctionalitiesmaster/'+this.companyName, this.httpOptions);
    }
    getRoleScreenFunctionalities(roleId: Observable<any>) {

        return this.hClient.get(this.mainBeUrl + 'api/getrolescreenfunctionalities/' + roleId+'/'+this.companyName, this.httpOptions);

    }
    setRoleMaster(info: any): Observable<any> {
        info.companyName =this.companyName;
        return this.hClient.post(this.mainBeUrl + 'api/setRoleMaster', JSON.stringify(info), this.httpOptions);
    }
    setRoleAccess(info: any): Observable<any> {
      info.companyName =this.companyName;
      return this.hClient.post(this.mainBeUrl + 'api/setRoleAccess', JSON.stringify(info), this.httpOptions);
    }

}
