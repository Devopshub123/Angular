import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class EmsService {

  mainUrl = environment.apiUrl;
  userSession: any;
  httpOptions = {
    headers: new HttpHeaders({ 'content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
  }
  //// save new hire
  saveNewHireData(data: any) {
    return this.http.post(this.mainUrl + 'ems/api/setNewHire', JSON.stringify(data), this.httpOptions);
  }

  getProgramsMaster(id: any): any {
    return this.http.get(this.mainUrl + 'ems/api/getProgramsMaster/' + id, this.httpOptions);
  }
  setProgramsMaster(data: any): any {
    return this.http.post(this.mainUrl + 'ems/api/setProgramsMaster', data, this.httpOptions);
  }

  getProgramSchedules(id: any, data: any): any {
    return this.http.get(this.mainUrl + 'ems/api/getProgramSchedules/' + id + '/' + data, this.httpOptions);
  }
  setProgramSchedules(data: any): any {
    return this.http.post(this.mainUrl + 'ems/api/setProgramSchedules', data, this.httpOptions);
  }

  getEmployeeProgramSchedules(id: any): any {
    return this.http.get(this.mainUrl + 'ems/api/getEmployeeProgramSchedules/' + id, this.httpOptions);
  }
  setEmployeeProgramSchedules(data: any): any {
    return this.http.post(this.mainUrl + 'ems/api/setEmployeeProgramSchedules', data, this.httpOptions);
  }

  getChecklistsMaster(deptId:any,category: any): any {
    return this.http.get(this.mainUrl + 'ems/api/getChecklistsMaster/'+ deptId +'/' + category, this.httpOptions);
  }

  getChecklistsActiveMaster(deptId:any,category: any): any {
    return this.http.get(this.mainUrl + 'ems/api/getChecklistsMasterActive/'+ deptId +'/' + category +'/Active', this.httpOptions);
  }

  setChecklistsMaster(data: any): any {
    return this.http.post(this.mainUrl + 'ems/api/setChecklistsMaster', JSON.stringify(data), this.httpOptions);
  }

  getAllStatus(): any {
    return this.http.post(this.mainUrl + 'admin/api/getstatuslist', this.httpOptions);
  }
  //// save document category
  saveDocumentCategory(data: any) {
    return this.http.post(this.mainUrl + 'ems/api/setDocumentCategory', JSON.stringify(data), this.httpOptions);
  }
  /// get  document category list
  getDocumentCategoryList() {
    return this.http.get(this.mainUrl + 'ems/api/getDocumentCategory', this.httpOptions)
  }

  /**  get  document category list */
  getEmployeeDirectoryList() {
    return this.http.get(this.mainUrl + 'ems/api/getEmployeesList', this.httpOptions)
  }

  /**  get  document category list */
  getEmployeeBoardingCheckList(eid:any,category:any,deptId:any) {
    return this.http.get(this.mainUrl + 'ems/api/getEmployeeChecklists/'+eid+'/'+category+'/'+deptId, this.httpOptions)
  }
  /**set  employee resignation  */
  setEmployeeResignation(data: any): any {
    return this.http.post(this.mainUrl + 'ems/api/setEmployeeResignation', data, this.httpOptions);
  }
  /**get  employee resignation  */
  getEmployeesResignation(id: any): any {
    return this.http.get(this.mainUrl + 'ems/api/getEmployeesResignation/' + id, this.httpOptions);
  }
  /**get  active termination categories*/
  getActiveTerminationCategories(): any {
    return this.http.get(this.mainUrl + 'ems/api/getActiveTerminationCategories', this.httpOptions);
  }
  /**get  active termination categories*/
  getEmployeeslistforTermination(): any {
    return this.http.get(this.mainUrl + 'ems/api/getEmployeeslistforTermination', this.httpOptions);
  }
  /**set  employee termination*/
  setEmployeeTermination(data: any): any {
    return this.http.post(this.mainUrl + 'ems/api/setEmployeeTermination', data, this.httpOptions);
  }
  /**get  employee termination*/
  getEmployeesTermination(data: any): any {
    return this.http.get(this.mainUrl + 'ems/api/getEmployeesTermination/' + data, this.httpOptions);
  }
  getDepartmentEmployeesByDesignation(id: any, data: any): any {
    return this.http.get(this.mainUrl + 'ems/api/getDepartmentEmployeesByDesignation/' + id + '/' + data, this.httpOptions);
  }

  /**get  active termination categories*/
  getNewHiredEmployeeList(id: any): any {
    return this.http.get(this.mainUrl + 'ems/api/getNewHireDetails/' + id, this.httpOptions);
  }
  getNewHiredEmployeeLists(id: any): any {
    return this.http.get(this.mainUrl + 'ems/api/getNewHireDetails/' + id, this.httpOptions);
  }
  setProgramSchedulemail(data: any): any {
    console.log(data)
    return this.http.post(this.mainUrl + 'ems/api/setProgramSchedulemail', data, this.httpOptions);
  }
  getallEmployeeProgramSchedules(eid: any, sid: any): any {
    return this.http.get(this.mainUrl + 'ems/api/getallEmployeeProgramSchedules/' + eid + '/' + sid, this.httpOptions);
  }
  getEmployeesForProgramSchedule(id: any): any {
    return this.http.get(this.mainUrl + 'ems/api/getEmployeesForProgramSchedule/' + id, this.httpOptions);

  }

  /** save candidate information */
  savePreOnboardingCandidateInfo(data: any) {
    return this.http.post(this.mainUrl + 'ems/api/setPreonboardCandidateInformation', JSON.stringify(data), this.httpOptions);
  }

  getPreonboardCandidateData(id: any): Observable<any> {
    return this.http.get(this.mainUrl + 'ems/api/getCandidateDetails/' + id);
  }

  /** save candidate information */
  savePreOnboardingCandidateExperience(data: any) {
    return this.http.post(this.mainUrl + 'ems/api/setCandidateExperience', JSON.stringify(data), this.httpOptions);
  }

  /** save candidate education */
  savePreOnboardingCandidateEducation(data: any) {
    return this.http.post(this.mainUrl + 'ems/api/setCandidateEducation', JSON.stringify(data), this.httpOptions);
  }

  /**set Employee Master Data */
  saveEmployeeInformationData(data: any) {
    return this.http.post(this.mainUrl + 'ems/api/setEmpPersonalInfo', JSON.stringify(data), this.httpOptions);
  }

  /** */
  getEmployeeInformationData(id: any): Observable<any> {
    return this.http.get(this.mainUrl + 'ems/api/getEmpPersonalInfo/' + id);
  }
  /** */
  setselectEmployeesProgramSchedules(data: any): any {
    return this.http.post(this.mainUrl + 'ems/api/setselectEmployeesProgramSchedules', data, this.httpOptions);
  }
  /** */
  updateselectEmployeesProgramSchedules(data: any): any {
    return this.http.post(this.mainUrl + 'ems/api/updateselectEmployeesProgramSchedules', data, this.httpOptions);
  }
  /** setEmsEmployeeColumnConfigurationValues */
  setEmsEmployeeColumnConfigurationValues(data: any): any {
    return this.http.post(this.mainUrl + 'ems/api/setEmsEmployeeColumnConfigurationValues', data, this.httpOptions);
  }
  /** */
  getEmsEmployeeColumnConfigurationValue(id: any): Observable<any> {
    return this.http.get(this.mainUrl + 'ems/api/getEmsEmployeeColumnConfigurationValue/' + id);
  }
  /**usersLogin */
  usersLogin(data: any): any {
    return this.http.post(this.mainUrl + 'ems/api/usersLogin', data, this.httpOptions);
  }
  /**getUserLoginData */
  getUserLoginData(): Observable<any> {
    return this.http.get(this.mainUrl + 'ems/api/getUserLoginData/');
  }
  getEmsEmployeeColumnFilterData(): any {
    return this.http.get(this.mainUrl + 'ems/api/getEmsEmployeeColumnFilterData/');
  }
  getEmsEmployeeDataForReports(data:any):any{
    return this.http.post(this.mainUrl + 'ems/api/getEmsEmployeeDataForReports', data, this.httpOptions);

  }

    //// get messages list
    getMessagesListApi(data:any): Observable<any>{
      return this.http.post(this.mainUrl+'ems/api/Messages', JSON.stringify(data), this.httpOptions);
    }

  /** */
  /**set Employee job Data */
  saveEmployeeJobDetailsData(data: any) {
    return this.http.post(this.mainUrl + 'ems/api/setEmpJobDetails', JSON.stringify(data), this.httpOptions);
  }
  /** */
  getEmployeeJobData(id: any): Observable<any> {
    return this.http.get(this.mainUrl + 'ems/api/getEmpJobDetails/' + id);
  }
  /**set Employee employement Data */
  saveEmployeeEmployementData(data: any) {
    return this.http.post(this.mainUrl + 'ems/api/setEmpEmployement', JSON.stringify(data), this.httpOptions);
  }
  /** */
  getEmployeeEmployement(id: any): Observable<any> {
    return this.http.get(this.mainUrl + 'ems/api/getEmpEmployement/' + id);
  }
  /**set Employee education Data */
  saveEmployeeEducationData(data: any) {
    return this.http.post(this.mainUrl + 'ems/api/setEmpEducationDetails', JSON.stringify(data), this.httpOptions);
  }
  /** */
  getEmployeeEducationData(id: any): Observable<any> {
    return this.http.get(this.mainUrl + 'ems/api/getEmpEducationDetails/' + id);
  }

  /** */
  getOnboardingSettings(): Observable<any> {
    return this.http.get(this.mainUrl + 'ems/api/getOnboardingSettings/');
  }
  /** */
  getOffboardingSettings(): Observable<any> {
    return this.http.get(this.mainUrl + 'ems/api/getOffboardingSettings/',this.httpOptions);
  }
  getEmployePendingChecklist(data:any): any {
        return this.http.post(this.mainUrl + 'ems/api/getEmployeesPendingChecklists/',data, this.httpOptions);
      }
 /**set Offboarding Settings */
 setOffboardingSettings(data:any){
    return this.http.post(this.mainUrl+'ems/api/setOffboardingSettings', data, this.httpOptions);
  }
  /** get active announcements*/
  getActiveAnnouncementsTopics(): Observable<any>{
    return this.http.get(this.mainUrl + 'ems/api/getActiveAnnouncementsTopics/',this.httpOptions);
  }
  getAnnouncements(id:any): Observable<any>{
    return this.http.get(this.mainUrl + 'ems/api/getAnnouncements/'+id,this.httpOptions);
  }
  setAnnouncements(data:any): Observable<any>{
    return this.http.post(this.mainUrl + 'ems/api/setAnnouncements/',data,this.httpOptions);
  }
  /**set Onboarding Settings */
  setOnboardingSettings(onboarddata:any){
    return this.http.post(this.mainUrl+'ems/api/setOnboardingSettings', onboarddata, this.httpOptions);
  }

  getEmpAnnouncements(): Observable<any>{
    return this.http.get(this.mainUrl + 'ems/api/getEmpAnnouncements/',this.httpOptions);

    }
      /**getFilesForApproval */
  getFilesForApproval(): Observable<any>{
    return this.http.get(this.mainUrl + 'ems/api/getFilesForApproval/',this.httpOptions);
  }
   /**getFilesForApproval */
   documentApproval(data:any): Observable<any>{
    return this.http.post(this.mainUrl + 'ems/api/documentApproval/',data,this.httpOptions);
  }

  /** pending  Approvals For HR*/
  getEmployeesResignationForHr(info:any) {
    return this.http.post(this.mainUrl + 'ems/api/getEmployeesResignationForHr', info, this.httpOptions);
  }
  setEmployeeChecklists(data:any):Observable<any>{
    return this.http.post(this.mainUrl + 'ems/api/setEmployeeChecklists',data,this.httpOptions);
  }

  getEmployeTerminationPendingChecklist(data:any): any {
    return this.http.post(this.mainUrl + 'ems/api/getEmpOffboardTerminationChecklists/',data , this.httpOptions);
  }

  getEmployeResignationPendingChecklist(data:any): any {
    return this.http.post(this.mainUrl + 'ems/api/getEmpResignationPendingChecklists/',data , this.httpOptions);
  }

  getReportingManagerForEmp(eid: any): any {

    return this.http.get(this.mainUrl + 'ems/api/getReportingManagerForEmp/' + eid , this.httpOptions);
  }
  getHrDetails(): any {

    return this.http.get(this.mainUrl + 'ems/api/getHrDetails/',this.httpOptions);
  }
  getnoticeperiods(): any {

    return this.http.get(this.mainUrl + 'ems/api/getnoticeperiods/',this.httpOptions);
  }

  /** setProgramsMasterStatus*/
  setProgramsMasterStatus(data: any): any {
    return this.http.post(this.mainUrl + 'ems/api/setprogramspasterstatus', data, this.httpOptions);
  }

    /** */
    getEmployeeEmailDataByEmpid(eid: any): any {

      return this.http.get(this.mainUrl + 'ems/api/getEmailsByEmpid/' +eid,this.httpOptions);
    } 

  getActiveScheduleEmployeeList(sid: any): any {
    return this.http.get(this.mainUrl + 'ems/api/getActiveEmployeeProgramSchedules/'+ sid, this.httpOptions);
  }
  getInductionProgramAssignedEmployees(sid: any): any {
    return this.http.get(this.mainUrl + 'ems/api/getInductionProgramAssignedEmployee/'+ sid, this.httpOptions);
  }
  /**get employees list by department id */
  getEmployeesListByDeptId(did: any): any {
    return this.http.get(this.mainUrl + 'ems/api/getEmployeesListByDeptId/'+ did, this.httpOptions);
  }

   /** set Induction ConductedBy master*/
   setInductionConductedBy(data: any): any {
    return this.http.post(this.mainUrl + 'ems/api/setInductionConductedby', data, this.httpOptions);
  }

  /**get employees list by department id */
    getConductedByEmployeesList(): any {
      return this.http.get(this.mainUrl + 'ems/api/getInductionConductedbyEmployees', this.httpOptions);
  }
  
    /**get departments by program id */
    getDepartmentsByProgramId(pid: any): any {
      return this.http.get(this.mainUrl + 'ems/api/getDepartmentsByProgramId/'+ pid, this.httpOptions);
  }
  
    /** update Induction ConductedBy status*/
    updateInductionConductedByStatus(data: any): any {
      return this.http.post(this.mainUrl + 'ems/api/updateInductionConductedbyStatus', data, this.httpOptions);
  } 
  
      /**get departments by program id */
      getConductEmployeesByProgramIdAndDeptId(pid: any,did:any): any {
        return this.http.get(this.mainUrl + 'ems/api/getCondcutedEmployeesByPrgIdAndDeptId/'+ pid+'/'+did, this.httpOptions);
    }
}
