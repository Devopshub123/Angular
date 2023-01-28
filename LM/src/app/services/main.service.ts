import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {Observable} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class MainService {
  mainBeUrl= environment.apiUrl;
  userSession: any;
  httpOptions:any;
  companyName:any;
  constructor(private http: HttpClient) {
    this.companyName= sessionStorage.getItem("companyName")?sessionStorage.getItem("companyName"):null;
    this.httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'application/json',
        "Authorization": JSON.parse(JSON.stringify(sessionStorage.getItem('token') || '')),
      })
    };
  }
/*Get Role Screen Functionalities*/
  getRoleScreenFunctionalities(data: any) {
    data.companyName= this.companyName;

    return this.http.post(this.mainBeUrl + 'attendance/api/getrolescreenfunctionalities',data, this.httpOptions);
  }
/*Get Role Screen Functionalities Based on RoleId*/
  getrolescreenfunctionalitiesforrole(data: any) {
    data.companyName= this.companyName;

    return this.http.post(this.mainBeUrl + 'attendance/api/getrolescreenfunctionalitiesforrole',data, this.httpOptions);

  }

  getProfileImage(info: any): Observable<any> {
   this.companyName = sessionStorage.getItem("companyName") ? sessionStorage.getItem("companyName") : null;
    return this.http.post(this.mainBeUrl + 'api/getProfileImage/'+this.companyName+'/', info,this.httpOptions);
  }
  getCompoffleavestatus():Observable<any> {
    return this.http.get(this.mainBeUrl + 'api/getcompoffleavestatus/'+this.companyName, this.httpOptions) ;
  }
  getFilesMaster(info:any):Observable<any>{
    info.companyName=this.companyName
    return this.http.post(this.mainBeUrl + 'api/getFilesMaster/', info,this.httpOptions);
  }

   /** save candidate information */
    savePreOnboardingCandidateInfo(data:any){
     data.companyName=this.companyName

     return this.http.post(this.mainBeUrl+'ems/api/setPreonboardCandidateInformation', JSON.stringify(data), this.httpOptions);
  }

  getPreonboardCandidateData(id: any,cname:any): Observable<any> {
    this.companyName = cname;
    return this.http.get(this.mainBeUrl + 'ems/api/getCandidateDetails/' + id+'/'+this.companyName, this.httpOptions);
  }

    /** save candidate information */
      savePreOnboardingCandidateExperience(data:any){
      data.companyName=this.companyName

      return this.http.post(this.mainBeUrl+'ems/api/setCandidateExperience', JSON.stringify(data), this.httpOptions);
  }

  /** save candidate education */
  savePreOnboardingCandidateEducation(data:any){
    data.companyName=this.companyName

    return this.http.post(this.mainBeUrl+'ems/api/setCandidateEducation', JSON.stringify(data), this.httpOptions);
}

  getFileMasterForEMS(input:any){
    return this.http.post(this.mainBeUrl+'ems/api/getFileMasterForEMS', JSON.stringify(input), this.httpOptions);

  }

  getFilecategoryMasterForEMS(input:any){
    input.companyName=this.companyName;
    return this.http.post(this.mainBeUrl+'ems/api/getFilecategoryMasterForEMS', JSON.stringify(input), this.httpOptions);

  }
  getFilepathsMasterForEMS(moduleId:any):Observable<any>{

    return this.http.get(this.mainBeUrl + 'ems/api/getFilepathsMasterForEMS/'+moduleId+'/'+this.companyName, this.httpOptions);
  }

  setFilesMasterForEMS(info:any): Observable<any> {
    info.companyName=this.companyName;

    return this.http.post(this.mainBeUrl + 'ems/api/setFilesMasterForEMS/', info, this.httpOptions);
  }
  setDocumentOrImageForEMS(data: FormData): Observable<any> {

    return this.http.post(this.mainBeUrl + 'ems/api/setDocumentOrImageForEMS/', data, this.httpOptions);
  }
  getDocumentsForEMS(input:any){
    input.companyName=this.companyName;
    return this.http.post(this.mainBeUrl+'ems/api/getDocumentsForEMS', JSON.stringify(input), this.httpOptions);

  }
  getDocumentOrImagesForEMS(info:any): Observable<any> {
    info.companyName=this.companyName;
    return this.http.post(this.mainBeUrl + 'ems/api/getDocumentOrImagesForEMS/' ,info,this.httpOptions)
  }
  removeDocumentOrImagesForEMS(info:any): Observable<any> {
    return this.http.delete(this.mainBeUrl + 'ems/api/removeDocumentOrImagesForEMS/'+this.companyName +'/'+encodeURI(info),this.httpOptions);
  }
  /** For AWS*/
  // removeDocumentOrImagesForEMS(info:any): Observable<any> {
  //   return this.http.post(this.mainBeUrl + 'ems/api/removeDocumentOrImagesForEMS/',info,this.httpOptions);
  // }
  deleteFilesMaster(id:any):Observable<any>{
    return this.http.get(this.mainBeUrl + 'ems/api/deleteFilesMaster/'+id+'/'+this.companyName, this.httpOptions);
  }


  /** */
  getEmployeeAttendanceCounts(mid: any,empid:any,date:any): Observable<any> {
    return this.http.get(this.mainBeUrl + 'ems/api/getAttendanceCountsForDate/' + mid +'/'+empid+'/'+date+'/'+this.companyName, this.httpOptions);
  }

  getSideNavigation(data: any) {
    data.companyName= this.companyName;
    return this.http.post(this.mainBeUrl + 'attendance/api/getSideNavigation',data, this.httpOptions);
  }
  /**get document files */
  getDocumentsFiles(input:any){
    input.companyName=this.companyName;
    return this.http.post(this.mainBeUrl+'ems/api/getDocumentsFiles', JSON.stringify(input), this.httpOptions);
  }
}
