import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
  })
  export class PayrollService {
    mainBeUrl= environment.apiUrl;
    userSession: any;
    httpOptions = {
      headers: new HttpHeaders({'content-Type': 'application/json'})
    };  
   
    constructor(private http: HttpClient) {
    }
    getEmployeeAttendanceNotifications(data:any):Observable<any>{
        return this.http.post(this.mainBeUrl +'attendance/api/getEmployeeAttendanceNotifications',data,this.httpOptions)
    }
    getesidetails():Observable<any>{
        return this.http.post(this.mainBeUrl +'payroll/api/getesidetails',this.httpOptions)
    }
    getemployerprofessionaltax():Observable<any>{
        return this.http.post(this.mainBeUrl +'payroll/api/employerprofessionaltax',this.httpOptions)
    }
    getemployeeprofessionaltax():Observable<any>{
        return this.http.post(this.mainBeUrl +'payroll/api/employeeprofessionaltax',this.httpOptions)
    }
    setincomegroup(data:any):Observable<any>{
        return this.http.post(this.mainBeUrl + 'payroll/api/setincomegroup', JSON.stringify(data), this.httpOptions);

    }
    getearningsalarycomponent(data:any):Observable<any>{
        return this.http.post(this.mainBeUrl +'payroll/api/getearningsalarycomponent/'+ data,this.httpOptions)
    }
    getdeductionsalarycomponent(data:any):Observable<any>{
        return this.http.post(this.mainBeUrl +'payroll/api/getdeductionsalarycomponent/'+data,this.httpOptions)
    }
    getpayrollsections():Observable<any>{
        return this.http.post(this.mainBeUrl +'payroll/api/getpayrollsections',this.httpOptions)
    }
    getsalarycomponentsforpaygroup(data:any):Observable<any>{
        return this.http.post(this.mainBeUrl +'payroll/api/getsalarycomponentsforpaygroup',JSON.stringify(data),this.httpOptions)
    }
    getpayrollincomegroups():Observable<any>{
        return this.http.post(this.mainBeUrl +'payroll/api/getpayrollincomegroups',this.httpOptions)
    }
    getEmployeeProfessionalTaxDetails():Observable<any>{
        return this.http.post(this.mainBeUrl +'payroll/api/getEmployeeProfessionalTaxDetails',this.httpOptions)
    }
    getErrorMessages(errorCode:any,page:any, size:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getErrorMessages/' + errorCode + '/' + page + '/' + size, this.httpOptions);
    }
    setErrorMessages(info:any): Observable<any> {
        return this.http.post(this.mainBeUrl + 'payroll/api/setErrorMessages', JSON.stringify(info), this.httpOptions);
    }
    getEmployeeDurationsForSalaryDisplay(userid:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getEmployeeDurationsForSalaryDisplay/'+ userid,this.httpOptions);
    }
    getCtcDetails(eid:any,ctcid:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getCtcDetails/'+ eid+'/'+ctcid,this.httpOptions);
    }
    getEmployeeInvestments(empid:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getEmployeeInvestments/'+ empid,this.httpOptions);
    }
    setEmployeeInvestments(data:any): Observable<any> {
        console.log(data)
        return this.http.post(this.mainBeUrl + 'payroll/api/setEmployeeInvestments', JSON.stringify(data), this.httpOptions);
    }
    getComponentEditableConfigurations(id:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getComponentEditableConfigurations/'+ id,this.httpOptions);
    }
    configurePayGroupComponent(data:any):Observable<any> {
        return this.http.post(this.mainBeUrl + 'payroll/api/configurePayGroupComponent/',JSON.stringify(data), this.httpOptions);
    }
    editPayGroupComponent(data:any):Observable<any> {
        return this.http.post(this.mainBeUrl + 'payroll/api/editPayGroupComponent/',JSON.stringify(data), this.httpOptions);
    }
    getPayGroupComponentValues(id:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getPayGroupComponentValues/'+ id,this.httpOptions);
    }
    getEmployeesListForInvestmentsApproval(): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getEmployeesListForInvestmentsApproval',this.httpOptions);
    }
    // getEmployeeEpfContributionOptions
    getEmployeeEpfContributionOptions(): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getEmployeeEpfContributionOptions',this.httpOptions);
    }
    // getEmployerEpfContributionOptions
    getEmployerEpfContributionOptions(): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getEmployerEpfContributionOptions',this.httpOptions);
    }
    //setCompanyEpfValues
    setCompanyEpfValues(data:any):Observable<any> {
        return this.http.post(this.mainBeUrl + 'payroll/api/setCompanyEpfValues/',JSON.stringify(data), this.httpOptions);
    }
    //getStatutoryMaxPfWageForEmployerContribution
    getStatutoryMaxPfWageForEmployerContribution(): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getStatutoryMaxPfWageForEmployerContribution',this.httpOptions);
    }
    // updateEpfWages
    updateEpfWages(data:any):Observable<any> {
        return this.http.post(this.mainBeUrl + 'payroll/api/updateEpfWages/',JSON.stringify(data), this.httpOptions);
    }
    // calculateMonthlyEpfValues
    calculateMonthlyEpfValues(data:any):Observable<any> {
        return this.http.post(this.mainBeUrl + 'payroll/api/calculateMonthlyEpfValues/',JSON.stringify(data), this.httpOptions);
    }
    
    deleteEmployeeInvestments(data:any):Observable<any> {
        console.log(data)
        return this.http.post(this.mainBeUrl + 'payroll/api/deleteEmployeeInvestments/',JSON.stringify(data), this.httpOptions);
    }
        // //getFilepathsMaster
    // getFilepathsMaster(moduleId:any):Observable<any>{
    //     return this.http.get(this.mainBeUrl + 'api/getFilepathsMaster/'+moduleId, this.httpOptions);
    // }
    // setFilesMaster(info:any): Observable<any> {
    //     return this.http.post(this.mainBeUrl + 'api/setFilesMaster/', info, this.httpOptions);
    // }
    // setProfileImage(data: FormData,path:any): Observable<any> {

    //     return this.http.post(this.mainBeUrl + 'api/setProfileImage/'+encodeURI(path), data);
    // }

    getFileMasterForEMS(input:any){
        return this.http.post(this.mainBeUrl+'ems/api/getFileMasterForEMS', JSON.stringify(input), this.httpOptions);
    
      }
    
      getFilecategoryMasterForEMS(input:any){
        return this.http.post(this.mainBeUrl+'ems/api/getFilecategoryMasterForEMS', JSON.stringify(input), this.httpOptions);
    
      }
      getFilepathsMasterForEMS(moduleId:any):Observable<any>{
        return this.http.get(this.mainBeUrl + 'ems/api/getFilepathsMasterForEMS/'+moduleId, this.httpOptions);
      }
    
      setFilesMasterForEMS(info:any): Observable<any> {
        return this.http.post(this.mainBeUrl + 'ems/api/setFilesMasterForEMS/', info, this.httpOptions);
      }
      setDocumentOrImageForEMS(data: FormData,path:any): Observable<any> {
        return this.http.post(this.mainBeUrl + 'ems/api/setDocumentOrImageForEMS/'+encodeURI(path), data);
      }
      getDocumentsForEMS(input:any){
        return this.http.post(this.mainBeUrl+'ems/api/getDocumentsForEMS', JSON.stringify(input), this.httpOptions);
    
      }
      getDocumentOrImagesForEMS(info:any): Observable<any> {
        // var conpanyName ='Apple'
        return this.http.post(this.mainBeUrl + 'ems/api/getDocumentOrImagesForEMS/' ,info,this.httpOptions)
      }
      removeDocumentOrImagesForEMS(info:any): Observable<any> {
        return this.http.delete(this.mainBeUrl + 'ems/api/removeDocumentOrImagesForEMS/'+encodeURI(info),this.httpOptions);
      }
      deleteFilesMaster(id:any):Observable<any>{
        return this.http.get(this.mainBeUrl + 'ems/api/deleteFilesMaster/'+id, this.httpOptions);
      }
      getCompanyPaySchedule(): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getCompanyPaySchedule',this.httpOptions);
      }
      setCompanyPaySchedule(input:any){
        return this.http.post(this.mainBeUrl+'payroll/api/setCompanyPaySchedule', JSON.stringify(input), this.httpOptions);
      }
      updateMonthlySalary(data:any){
        return this.http.post(this.mainBeUrl+'payroll/api/updateMonthlySalary', JSON.stringify(data), this.httpOptions);
      }
      getFinancialYears(): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getFinancialYears',this.httpOptions);
      }
      Month_Year(Month_Year:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/MonthYear/'+Month_Year,this.httpOptions);
      }
      getEpfDetails():Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getEpfDetails',this.httpOptions);
      }
      getEmployeeListForSalaryProcessing(Month:any,year:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getEmployeeListForSalaryProcessing/'+Month+'/'+year,this.httpOptions);
      }
      getEmployeesForAssignPaygroup():Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getEmployeesForAssignPaygroup',this.httpOptions);
      }
      getPayGroupsForCtc(Amount:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getPayGroupsForCtc/'+Amount,this.httpOptions);
      }
      getActiveComponentsValuesForPayGroup(id:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getActiveComponentsValuesForPayGroup/'+id,this.httpOptions);
      }
      assignPayGroup(data:any){
        return this.http.post(this.mainBeUrl+'payroll/api/assignPayGroup', JSON.stringify(data), this.httpOptions);
      }
      getComponentWiseValuesForPayGroupAssignment(data:any): Observable<any> {
        return this.http.get(this.mainBeUrl+'payroll/api/getComponentWiseValuesForPayGroupAssignment/'+data.CTC+'/'+data.paygroupid,this.httpOptions);
      }
      getEmployeePaySlips(data:any): Observable<any> {
        return this.http.get(this.mainBeUrl+'payroll/api/getEmployeePaySlips/'+data.fyear+'/'+data.id,this.httpOptions);
      }
      getEmployeePayslipDetails(data:any): Observable<any> {
        return this.http.get(this.mainBeUrl+'payroll/api/getEmployeePayslipDetails/'+data.id+'/'+data.empid,this.httpOptions);
      }
      getEmployeeEpfDetails(data:any): Observable<any> {
        return this.http.get(this.mainBeUrl+'payroll/api/getEmployeeEpfDetails/'+data,this.httpOptions);
      }
      getMonthlyPayrollData(data:any): Observable<any> {
        return this.http.get(this.mainBeUrl+'payroll/api/getMonthlyPayrollData/'+data.month+'/'+data.year+'/'+data.deptid,this.httpOptions);
      }
      getMonthlyPayrollDataForGraph(data:any): Observable<any> {
        return this.http.get(this.mainBeUrl+'payroll/api/getMonthlyPayrollDataForGraph/'+data.month+'/'+data.year,this.httpOptions);
      }
      getComponentConfiguredValuesForPayGroup(data:any): Observable<any> {
        return this.http.get(this.mainBeUrl+'payroll/api/getComponentConfiguredValuesForPayGroup/'+data.pgmid+'/'+data.flat,this.httpOptions);
      }
}