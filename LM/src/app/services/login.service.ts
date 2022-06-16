import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// import {subscription} from '../models/subscription';
// import { changePassword } from '../models/changePassword';
// import { resetPassword } from '../models/resetPassword';



@Injectable({
    providedIn: 'root'
  })
  export class LoginService {
    
      // host= localhost;
      // port = 6060;multipart/
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
  return this.hClient.get('http://localhost:6060/savesubscription', { responseType: 'json' });
}
getErrorMessages(errorCode:any,page:any, size:any): Observable<any> {
  console.log(errorCode)
  return this.hClient.get('http://localhost:6060/api/getErrorMessages/' + errorCode + '/' + page + '/' + size, this.httpOptions);
}
Savelogin(data:any): Observable<any> {
  // console.log("dddd", email,password)
  return this.hClient.post('http://localhost:6060/api/emp_login', JSON.stringify(data) ,this.httpOptions);
}  
 /* save change password */
changepassword(changePassword: any): Observable<any> {
  console.log("jjjj")
  return this.hClient.post('http://localhost:6060/changePassword', JSON.stringify(changePassword), this.httpOptions);
}
resetpassword(resetPassword:any) : Observable<any> {
  return this.hClient.post('http://localhost:6060/api/resetpassword', JSON.stringify(resetPassword), this.httpOptions);

}
// forgot password
verifyEmail(email: any): Observable<any> {
  return this.hClient.get('http://localhost:6060/api/forgetpassword/'+email,this.httpOptions);
}
}    