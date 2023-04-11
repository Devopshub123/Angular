import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class AdminService {
  mainUrl= environment.apiUrl;
  userSession: any;
  companyName:any;
  httpOptions:any;

  constructor(private http: HttpClient) {
    this.companyName= sessionStorage.getItem('companyName');
    this.httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'application/json',
        "Authorization": JSON.parse(JSON.stringify(sessionStorage.getItem('token') || '')),
      })
    };
  }
  setWorkLocation(info:any): Observable<any> {
    return this.http.post(this.mainUrl + 'api/setWorkLocation', JSON.stringify(info), this.httpOptions);
  }

  getWorkLocation(info:any): Observable<any>{
    return this.http.post(this.mainUrl + 'api/getWorkLocation',JSON.stringify(info), this.httpOptions);
  }

  getactiveWorkLocation(info:any): Observable<any>{
    return this.http.post(this.mainUrl + 'api/getactiveWorkLocation',JSON.stringify(info), this.httpOptions);
  }
  setHolidays(info:any,companyName:any):Observable<any>{
    return this.http.post(this.mainUrl+'api/setHolidays/'+companyName, JSON.stringify(info), this.httpOptions);
  }

  setHolidayStatus(info:any){
    return this.http.post(this.mainUrl+'api/setHolidayStatus', JSON.stringify(info), this.httpOptions);
  }
  putHolidays(info:any,companyName:any):Observable<any>{
    return this.http.put(this.mainUrl+'api/putHolidays/'+companyName, JSON.stringify(info), this.httpOptions);

  }
  getMastertable(tableName:any,status:any,page:any,size:any,companyName:any):Observable<any>{
    return this.http.get(this.mainUrl+'api/getMastertable/'+tableName+'/'+status+'/'+page+'/'+size+'/'+this.companyName, this.httpOptions);
  }
  deleteHoliday(holidayId:any):Observable<any>{
    return this.http.delete(this.mainUrl+'api/deleteHoliday/'+holidayId, this.httpOptions);

  }
  getHolidaysYearsOrLocation(columnName:any):Observable<any>{
    return this.http.get(this.mainUrl+'api/getHolidaysYears/'+columnName, this.httpOptions);

  }
  getHolidays(year:any,locationId:any,page:any,size:any):Observable<any>{
    return this.http.get(this.mainUrl+'api/getHolidysFilter/'+year+'/'+locationId+'/'+page+'/'+size, this.httpOptions);
  }
  getErrorMessages(errorCode:any,page:any, size:any): Observable<any> {
    return this.http.get(this.mainUrl + 'api/getErrorMessages/' + errorCode + '/' + page + '/' + size+'/'+this.companyName, this.httpOptions);
}
setErrorMessages(info:any): Observable<any> {
    info[0].companyName = this.companyName;
    return this.http.post(this.mainUrl + 'api/setErrorMessages', JSON.stringify(info), this.httpOptions);
}

setIntegrationEmpidsLookup(data:any): Observable<any> {
  data.companyName = this.companyName;
  return this.http.post(this.mainUrl + 'admin/api/setIntegrationEmpidsLookup', data, this.httpOptions);
}
getIntegrationEmpidsLookup(data:any): Observable<any> {
    data.companyName = this.companyName
  return this.http.post(this.mainUrl + 'admin/api/getIntegrationEmpidsLookup', data, this.httpOptions);
}
setShiftMaster(data:any):Observable<any>{
  data.companyName = this.companyName
  return this.http.post(this.mainUrl+ 'admin/api/setShiftMaster',data,this.httpOptions);
}
getAllShifts(): Observable<any>{
  return this.http.get(this.mainUrl + 'admin/api/getAllShifts/'+this.companyName, this.httpOptions);
}
getShiftsDetailsById(shift_id:any): Observable<any>{
  return this.http.get(this.mainUrl + 'admin/api/getShiftsDetailsById/'+shift_id+'/'+this.companyName, this.httpOptions);
}
getActiveShiftIds(): Observable<any>{
  return this.http.get(this.mainUrl + 'admin/api/getActiveShiftIds', this.httpOptions);
}
updateShiftStatus(data:any):Observable<any>{
  data.companyName = this.companyName
  return this.http.post(this.mainUrl+'admin/api/updateShiftStatus',data,this.httpOptions);
  }
  //// get messages list
  getMessagesListApi(data:any){
    data.companyName = this.companyName;
    return this.http.post(this.mainUrl+'admin/api/getAttendenceMessages', JSON.stringify(data), this.httpOptions);
  }
  //// update messages data
  updateMessagesData(data:any){
    data[0].companyName = this.companyName;
    return this.http.post(this.mainUrl+'admin/api/setAttendenceMessages', JSON.stringify(data), this.httpOptions);
  }
  getRolesByDepartment(data:any):Observable<any>{
    return this.http.post(this.mainUrl+'admin/api/getRolesByDepartment',data,this.httpOptions);
  }

  getEMSMessagesList(data:any){
    data.companyName = this.companyName;
    return this.http.post(this.mainUrl+'admin/api/getEMSMessages', JSON.stringify(data), this.httpOptions);
  }
  updateEMSMessagesData(data: any) {
    data[0].companyName = this.companyName;
    return this.http.post(this.mainUrl+'admin/api/setEMSMessages', JSON.stringify(data), this.httpOptions);
  }
  getstatuslists(){
    return this.http.get(this.mainUrl+'admin/api/getstatuslist/'+this.companyName, this.httpOptions)
  }
  //// save reason
 saveReasonData(data:any){
    data.companyName =this.companyName;
    return this.http.post(this.mainUrl+'ems/api/setReasonMaster', JSON.stringify(data), this.httpOptions);
  }
  /// get all reasons
  getAllReasonsList(){
    return this.http.get(this.mainUrl+'ems/api/getReasonMasterData/'+this.companyName, this.httpOptions)
  }
 /// get  reasons list
  getReasonsList(){
    return this.http.get(this.mainUrl+'ems/api/getActiveReasonList/'+this.companyName, this.httpOptions)
  }
 //// save termination category
 saveTerminationCategory(data:any){
   data.companyName =this.companyName;
   return this.http.post(this.mainUrl+'ems/api/setTerminationCategory/', JSON.stringify(data), this.httpOptions);
}
/// get  termination category list
getTerminationCategoryList(){
  return this.http.get(this.mainUrl+'ems/api/getTerminationCategory/'+this.companyName, this.httpOptions)
}
/// get Modules Screens Functionalitiesmaster
getModulesScreensFunctionalitiesmaster(){
  return this.http.get(this.mainUrl+'api/getModulesScreensFunctionalitiesmaster', this.httpOptions)
}
/// get Modules Screens
getModulesWithScreens(){
  return this.http.get(this.mainUrl+'api/getModulesWithScreens/'+this.companyName, this.httpOptions)
}
/// get Modules Screens Functionalitiesmaster
getScreenWithFunctionalities(moduleId:any){
  return this.http.get(this.mainUrl+'api/getScreenWithFunctionalities/'+moduleId+'/'+this.companyName, this.httpOptions)
}
//getRoleScreenfunctionalitiesByRoleId
getRoleScreenfunctionalitiesByRoleId(roleId: Observable<any>){
  return this.http.get(this.mainUrl+'api/getRoleScreenfunctionalitiesByRoleId/' + roleId+'/'+this.companyName, this.httpOptions)
}
getAllModules(){
  return this.http.post(this.mainUrl+'subscription/api/getAllModules/', this.httpOptions)
}
setSpryplePlan(data:any){
  return this.http.post(this.mainUrl+'subscription/api/setSpryplePlan/',JSON.stringify(data), this.httpOptions)
}
Validateemail(data:any){
  return this.http.post(this.mainUrl+'subscription/api/Validateemail',JSON.stringify(data), this.httpOptions)

}
// /subscription/api/getMinUserForPlan/:planid
getMinUserForPlan(data:any){
  return this.http.get(this.mainUrl+'subscription/api/getMinUserForPlan/'+data, this.httpOptions);
}
setPlanDetails(data:any){
  return this.http.post(this.mainUrl+'subscription/api/setPlanDetails',JSON.stringify(data), this.httpOptions)
}
getSpryplePlans(){
  return this.http.get(this.mainUrl+'subscription/api/getSpryplePlans', this.httpOptions);

}
getSpryplePlanCostDetails(){
  return this.http.get(this.mainUrl+'subscription/api/getSpryplePlanCostDetails', this.httpOptions);

}
getSprypleClientsOld(){
  return this.http.get(this.mainUrl+'subscription/api/getSprypleClients', this.httpOptions);
}
getPayments(){
  return this.http.get(this.mainUrl+'subscription/api/getPayments', this.httpOptions);
}
getUsers(data:any){
  return this.http.get(this.mainUrl+'subscription/api/getUsers/'+data, this.httpOptions);
}
enableRenewButton(data:any){
  return this.http.post(this.mainUrl+'subscription/api/enableRenewButton',JSON.stringify(data), this.httpOptions);
}
getClientPlanDetails(data:any){
  return this.http.post(this.mainUrl+'subscription/api/getClientPlanDetails',JSON.stringify(data), this.httpOptions);
}
addUsers(data:any){
  return this.http.post(this.mainUrl+'subscription/api/addUsers',JSON.stringify(data), this.httpOptions);
}
renewUsers(data:any){
  return this.http.post(this.mainUrl+'subscription/api/renewUsers',JSON.stringify(data), this.httpOptions);
}
addUsersDisplayInfo(data:any){
  return this.http.post(this.mainUrl+'subscription/api/addUsersDisplayInfo',JSON.stringify(data), this.httpOptions);
}
renewUsersDisplayInformation(data:any){
  return this.http.post(this.mainUrl+'subscription/api/renewUsersDisplayInformation',JSON.stringify(data), this.httpOptions);
}
getClientPaymentDetailsOld(data:any){
  return this.http.get(this.mainUrl+'subscription/api/getClientPaymentDetails/'+data+'/'+this.companyName, this.httpOptions);
}
  /** */
  getClientSubscriptionDetailsOld(data:any){
    return this.http.get(this.mainUrl+'subscription/api/getClientDetails/'+data+'/'+this.companyName, this.httpOptions);
  }
    /** get client subscription details by id*/
    getClientSubscriptionDetails(data:any){
      return this.http.get(this.mainUrl+'subscription/api/getSprypleClientDetailsByClientId/'+data+'/'+this.companyName, this.httpOptions);
  }
  /** get client payments invoice history */
  getClientPaymentDetails(data:any){
    return this.http.get(this.mainUrl+'subscription/api/getPaymentsDetailsByClientId/'+data+'/'+this.companyName, this.httpOptions);
  }

   /** get payment invoice history data by payment id */
   getInvoiceDataById(data:any){
    return this.http.get(this.mainUrl+'subscription/api/getPaymentInvoiceDataByPaymentid/'+data+'/'+this.companyName, this.httpOptions);
  }
  /**get all spryple clients list */
  getAllSprypleClients(){
    return this.http.get(this.mainUrl+'subscription/api/getAllSprypleClientDetails/'+this.companyName, this.httpOptions);
  }
}
