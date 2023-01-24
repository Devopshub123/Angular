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
    companyName:any;
    httpOptions: any;  
   
    constructor(private http: HttpClient) {
      this.companyName = sessionStorage.getItem("companyName") ? sessionStorage.getItem("companyName") : null;
      this.httpOptions = {
        headers: new HttpHeaders({
          'content-Type': 'application/json',
          "Authorization": JSON.parse(JSON.stringify(sessionStorage.getItem('token') || '')),
        })
      };
      
    }
    // getEmployeeAttendanceNotifications(data:any):Observable<any>{
    //   data.companyName =  this.companyName;
    //     return this.http.post(this.mainBeUrl +'attendance/api/getEmployeeAttendanceNotifications',data,this.httpOptions)
    // }
    getesidetails():Observable<any>{
      
        return this.http.get(this.mainBeUrl +'api/getesidetails/'+ this.companyName,this.httpOptions)
    }
    getemployerprofessionaltax():Observable<any>{
        return this.http.get(this.mainBeUrl +'api/employerprofessionaltax/'+ this.companyName,this.httpOptions)
    }
    getemployeeprofessionaltax():Observable<any>{
        return this.http.get(this.mainBeUrl +'api/employeeprofessionaltax/'+ this.companyName,this.httpOptions)
    }
    setincomegroup(data:any):Observable<any>{
      data.companyName =  this.companyName;
      return this.http.post(this.mainBeUrl + 'api/setincomegroup', JSON.stringify(data), this.httpOptions);

    }
    getearningsalarycomponent(data:any):Observable<any>{
      console.log("kkk")
      return this.http.post(this.mainBeUrl +'api/getearningsalarycomponent/'+ data+'/'+this.companyName,this.httpOptions)
    }
    getdeductionsalarycomponent(data:any):Observable<any>{
        return this.http.post(this.mainBeUrl +'api/getdeductionsalarycomponent/'+data+'/'+this.companyName,this.httpOptions)
    }
    getpayrollsections():Observable<any>{
      console.log("kkkkkkjh")
        return this.http.post(this.mainBeUrl +'api/getpayrollsections/'+this.companyName,this.httpOptions)
    }
    getsalarycomponentsforpaygroup(data:any):Observable<any>{
      data.companyName =  this.companyName;
      return this.http.post(this.mainBeUrl +'api/getsalarycomponentsforpaygroup',JSON.stringify(data),this.httpOptions)
    }
    getpayrollincomegroups():Observable<any>{
        return this.http.get(this.mainBeUrl +'api/getpayrollincomegroups/'+this.companyName,this.httpOptions)
    }
    getEmployeeProfessionalTaxDetails():Observable<any>{
        return this.http.post(this.mainBeUrl +'api/getEmployeeProfessionalTaxDetails',this.httpOptions)
    }
    getErrorMessages(errorCode:any,page:any, size:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'payroll/api/getErrorMessages/' + errorCode + '/' + page + '/' + size+'/'+this.companyName, this.httpOptions);
    }
    setErrorMessages(info:any): Observable<any> {
      // info.companyName = this.companyName;
        return this.http.post(this.mainBeUrl + 'payroll/api/setErrorMessages/'+this.companyName, JSON.stringify(info), this.httpOptions);
    }
    getEmployeeDurationsForSalaryDisplay(userid:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/getEmployeeDurationsForSalaryDisplay/'+ userid+'/'+this.companyName,this.httpOptions);
    }
    getCtcDetails(eid:any,ctcid:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/getCtcDetails/'+ eid+'/'+ctcid+'/'+this.companyName,this.httpOptions);
    }
    getEmployeeInvestments(empid:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/getEmployeeInvestments/'+ empid+'/'+this.companyName,this.httpOptions);
    }
    setEmployeeInvestments(data:any): Observable<any> {
        data.companyName = this.companyName;
        return this.http.post(this.mainBeUrl + 'api/setEmployeeInvestments', JSON.stringify(data), this.httpOptions);
    }
    getComponentEditableConfigurations(id:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/getComponentEditableConfigurations/'+ id+'/'+this.companyName,this.httpOptions);
    }
    configurePayGroupComponent(data:any):Observable<any> {
      data.companyName = this.companyName;
      return this.http.post(this.mainBeUrl + 'api/configurePayGroupComponent/',JSON.stringify(data), this.httpOptions);
    }
    editPayGroupComponent(data:any):Observable<any> {
      data.companyName = this.companyName;
      return this.http.post(this.mainBeUrl + 'api/editPayGroupComponent/',JSON.stringify(data), this.httpOptions);
    }
    getPayGroupComponentValues(id:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/getPayGroupComponentValues/'+ id+'/'+this.companyName,this.httpOptions);
    }
    getEmployeesListForInvestmentsApproval(): Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/getEmployeesListForInvestmentsApproval/'+this.companyName,this.httpOptions);
    }
    // getEmployeeEpfContributionOptions
    getEmployeeEpfContributionOptions(): Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/getEmployeeEpfContributionOptions/'+this.companyName,this.httpOptions);
    }
    // getEmployerEpfContributionOptions
    getEmployerEpfContributionOptions(): Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/getEmployerEpfContributionOptions/'+this.companyName,this.httpOptions);
    }
    //setCompanyEpfValues
    setCompanyEpfValues(data:any):Observable<any> {
      data.companyName = this.companyName;
      return this.http.post(this.mainBeUrl + 'api/setCompanyEpfValues/',JSON.stringify(data), this.httpOptions);
    }
    //getStatutoryMaxPfWageForEmployerContribution
    getStatutoryMaxPfWageForEmployerContribution(): Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/getStatutoryMaxPfWageForEmployerContribution/'+this.companyName,this.httpOptions);
    }
    // updateEpfWages
    updateEpfWages(data:any):Observable<any> {
      data.companyName = this.companyName;
      return this.http.post(this.mainBeUrl + 'api/updateEpfWages/',JSON.stringify(data), this.httpOptions);
    }
    // calculateMonthlyEpfValues
    calculateMonthlyEpfValues(data:any):Observable<any> {
      data.companyName = this.companyName;
      return this.http.post(this.mainBeUrl + 'api/calculateMonthlyEpfValues/',JSON.stringify(data), this.httpOptions);
    }
    
    deleteEmployeeInvestments(data:any):Observable<any> {
      data.companyName = this.companyName;
      return this.http.post(this.mainBeUrl + 'api/deleteEmployeeInvestments/',JSON.stringify(data), this.httpOptions);
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
      input.companyName = this.companyName;
      return this.http.post(this.mainBeUrl+'ems/api/getFileMasterForEMS', JSON.stringify(input), this.httpOptions);
    
      }
    
      getFilecategoryMasterForEMS(input:any){
       input.companyName = this.companyName;
        return this.http.post(this.mainBeUrl+'ems/api/getFilecategoryMasterForEMS', JSON.stringify(input), this.httpOptions);
    
      }
      getFilepathsMasterForEMS(moduleId:any):Observable<any>{
        return this.http.get(this.mainBeUrl + 'ems/api/getFilepathsMasterForEMS/'+moduleId+'/'+this.companyName, this.httpOptions);
      }
    
      setFilesMasterForEMS(info:any): Observable<any> {
        info.companyName = this.companyName;
        return this.http.post(this.mainBeUrl + 'ems/api/setFilesMasterForEMS/', info, this.httpOptions);
      }
      setDocumentOrImageForEMS(data: FormData,path:any): Observable<any> {
        
        return this.http.post(this.mainBeUrl + 'ems/api/setDocumentOrImageForEMS/'+encodeURI(path)+'/'+this.companyName, data,this.httpOptions);
      }
      getDocumentsForEMS(input:any){
        input.companyName = this.companyName;
        return this.http.post(this.mainBeUrl+'ems/api/getDocumentsForEMS', JSON.stringify(input), this.httpOptions);
    
      }
      getDocumentOrImagesForEMS(info:any): Observable<any> {
        info.companyName = this.companyName;
        return this.http.post(this.mainBeUrl + 'ems/api/getDocumentOrImagesForEMS/' ,info,this.httpOptions)
      }
      removeDocumentOrImagesForEMS(info:any): Observable<any> {
        return this.http.delete(this.mainBeUrl + 'ems/api/removeDocumentOrImagesForEMS/'+encodeURI(info),this.httpOptions);
      }
      deleteFilesMaster(id:any):Observable<any>{
        return this.http.get(this.mainBeUrl + 'ems/api/deleteFilesMaster/'+id+'/'+this.companyName, this.httpOptions);
      }
      getCompanyPaySchedule(): Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/getCompanyPaySchedule/'+this.companyName,this.httpOptions);
      }
      setCompanyPaySchedule(input:any){
        input.companyName = this.companyName;
        return this.http.post(this.mainBeUrl+'api/setCompanyPaySchedule', JSON.stringify(input), this.httpOptions);
      }
      updateMonthlySalary(data:any){
        data.companyName = this.companyName;
        return this.http.post(this.mainBeUrl+'api/updateMonthlySalary', JSON.stringify(data), this.httpOptions);
      }
      getFinancialYears(): Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/getFinancialYears/'+this.companyName,this.httpOptions);
      }
      Month_Year(Month_Year:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/MonthYear/'+Month_Year+'/'+this.companyName,this.httpOptions);
      }
      getEpfDetails():Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/getEpfDetails/'+this.companyName,this.httpOptions);
      }
      getEmployeeListForSalaryProcessing(Month:any,year:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/getEmployeeListForSalaryProcessing/'+Month+'/'+year+'/'+this.companyName,this.httpOptions);
      }
      getEmployeesForAssignPaygroup():Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/getEmployeesForAssignPaygroup/'+this.companyName,this.httpOptions);
      }
      getPayGroupsForCtc(Amount:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/getPayGroupsForCtc/'+Amount+'/'+this.companyName,this.httpOptions);
      }
      getActiveComponentsValuesForPayGroup(id:any): Observable<any> {
        return this.http.get(this.mainBeUrl + 'api/getActiveComponentsValuesForPayGroup/'+id+'/'+this.companyName,this.httpOptions);
      }
      assignPayGroup(data:any){
        data.companyName = this.companyName;
        return this.http.post(this.mainBeUrl+'api/assignPayGroup', JSON.stringify(data), this.httpOptions);
      }
      getComponentWiseValuesForPayGroupAssignment(data:any): Observable<any> {
        return this.http.get(this.mainBeUrl+'api/getComponentWiseValuesForPayGroupAssignment/'+data.CTC+'/'+data.paygroupid+'/'+this.companyName,this.httpOptions);
      }
      getEmployeePaySlips(data:any): Observable<any> {
        return this.http.get(this.mainBeUrl+'api/getEmployeePaySlips/'+data.fyear+'/'+data.id+'/'+this.companyName,this.httpOptions);
      }
      getEmployeePayslipDetails(data:any): Observable<any> {
        return this.http.get(this.mainBeUrl+'api/getEmployeePayslipDetails/'+data.id+'/'+data.empid+'/'+this.companyName,this.httpOptions);
      }
      getEmployeeEpfDetails(data:any): Observable<any> {
        return this.http.get(this.mainBeUrl+'api/getEmployeeEpfDetails/'+data+'/'+this.companyName,this.httpOptions);
      }
      getMonthlyPayrollData(data:any): Observable<any> {
        return this.http.get(this.mainBeUrl+'api/getMonthlyPayrollData/'+data.month+'/'+data.year+'/'+data.deptid+'/'+this.companyName,this.httpOptions);
      }
      getMonthlyPayrollDataForGraph(data:any): Observable<any> {
        console.log("data",data);
        return this.http.get(this.mainBeUrl+'api/getMonthlyPayrollDataForGraph/'+data.month+'/'+data.year+'/'+this.companyName,this.httpOptions);
      }
      getComponentConfiguredValuesForPayGroup(data:any): Observable<any> {
        return this.http.get(this.mainBeUrl+'api/getComponentConfiguredValuesForPayGroup/'+data.pgmid+'/'+data.flat+'/'+this.companyName,this.httpOptions);
      }
}