import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// import {subscription} from '../models/subscription';
// import { changePassword } from '../models/changePassword';
// import { resetPassword } from '../models/resetPassword';



@Injectable({
    providedIn: 'root'
  })
  export class LoginService {
    mainBeUrl= environment.apiUrl;
      userSession: any;
      httpOptions = {
        headers: new HttpHeaders({'content-Type': 'application/json'})
      };
        httpOptionsOne = {
          headers: new HttpHeaders({'content-Type': 'multipart/form-data'})
        };

    constructor(private hClient: HttpClient) {
        this.userSession = ((sessionStorage.getItem('user')))

    }


/* get All Subscriptions */

getallSubscriptions():Observable<any>{
  return this.hClient.get(this.mainBeUrl + 'savesubscription', { responseType: 'json' });
}
getErrorMessages(errorCode:any,page:any, size:any): Observable<any> {
  return this.hClient.get(this.mainBeUrl + 'api/getErrorMessages/' + errorCode + '/' + page + '/' + size, this.httpOptions);
}
Savelogin(data:any): Observable<any> {
  return this.hClient.post(this.mainBeUrl + 'api/emp_login', JSON.stringify(data) ,this.httpOptions);
}
 /* save change password */
changepassword(changePassword: any): Observable<any> {
  return this.hClient.post(this.mainBeUrl + 'changePassword', JSON.stringify(changePassword), this.httpOptions);
}
resetpassword(resetPassword:any) : Observable<any> {
  return this.hClient.post(this.mainBeUrl + 'attendance/api/resetpassword', JSON.stringify(resetPassword), this.httpOptions);

}
// forgot password
verifyEmail(email: any): Observable<any> {
  return this.hClient.get(this.mainBeUrl + 'attendance/api/forgetpassword/'+email,this.httpOptions);
}
// forgot password
// getModules(): Observable<any> {
//   return this.hClient.get(this.mainBeUrl + 'attendance/api/getModules',this.httpOptions);
// }
getModules(tableName:any,status:any,page:any,size:any,companyName:any): Observable<any>{
  return this.hClient.get(this.mainBeUrl + 'api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+companyName, this.httpOptions);
}
getrolescreenfunctionalities(empId:any,moduleId:any): Observable<any>{
  return this.hClient.get(this.mainBeUrl + 'attendance/api/getrolescreenfunctionalities/'+empId+'/'+moduleId, this.httpOptions);
}

}
