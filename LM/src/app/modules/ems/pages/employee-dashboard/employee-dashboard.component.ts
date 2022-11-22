import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { MainService } from 'src/app/services/main.service';
import { EmsService } from '../../ems.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router,
    private adminService: AdminService,
    private emsService: EmsService, private companyService: CompanySettingService,
    private mainService: MainService,) { }
  employeeInformationData: any = [];
  employeeId: any;
  employeeNameh: any;
  employeeCode: any;
  employeeDesignation: any;
  employeeJoinDate: any;
  employeeMobile: any;
  employeeDepartment: any;
  employeeEmail: any;
  reportingManagerName: any;
  userSession: any;
  announcementsDetails:any=[];
  onboardingDetails:any=[];
  inductionProgram:any=[];
  reportingManager:any=[];
  hrReportingManager:any=[];
financeManager:any=[]
  count:any;
  availableDepartments: any = [];

  profileId:any=null;
  profileInfo:any=null;
  imageurls = [{
    base64String: "assets/img/profile.jpg"
  }];
  base64String: any;
  imagePath: any;
  isRemoveImage:boolean=true;
  companyDBName:any = environment.dbName;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getDepartmentsMaster();
    this.getEmployeeInformationList();
    this.getEmpAnnouncements();
    this.getEmployeeOnboardingCheckList();
    this.getallEmployeeProgramSchedules();
    this.getReportingManagerForEmp();
    this.getHrDetails();
    this.getEmployeeImage();
  }
  public barChartType: ChartType = 'bar';

  public data: ChartData<'bar'> = {
    labels: ['Org-1', 'Org-2', 'Org-3','Org-4','Org-5','Org-6'],
    datasets: [
      {
        label: 'data 1',
        data: [350, 450, 100, 200, 400, 300],
        backgroundColor: ['rgb(54, 162, 235)',  ],
      },
    ]
  };

  public options: ChartOptions<'bar'> = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
    /** through employee directory login data  */
    getEmployeeInformationList() {
      this.employeeInformationData = [];
      this.emsService.getEmployeeInformationData(this.userSession.id).subscribe((res: any) => {

        this.employeeInformationData = JSON.parse(res.data[0].json)[0];

        this.employeeNameh = this.employeeInformationData.firstname + ' ' + this.employeeInformationData.middlename +' '+ this.employeeInformationData.lastname;
       this.employeeCode = this.employeeInformationData.empid;
       this.employeeJoinDate = this.employeeInformationData.dateofjoin;
       this.employeeMobile = this.employeeInformationData.contactnumber;
       this.employeeEmail = this.employeeInformationData.officeemail;
        this.employeeEmail = this.employeeInformationData.officeemail;
        //this.employeeDepartment =
        this.availableDepartments.forEach((e:any)=> {
          if (e.id ==  this.employeeInformationData.department) {
            this.employeeDepartment = e.deptname;
        }
        });

      })
    }
    getDepartmentsMaster() {
      this.companyService.getMastertable('departmentsmaster', 1, 1, 1000, this.companyDBName).subscribe(data => {
        if (data.status) {
          this.availableDepartments = data.data;
        }
      })
    }
  employeeProfile() {
    let empId=this.userSession.id
    this.router.navigate(["/ems/employee-profile",{empId}])
 }

 getEmpAnnouncements(){
  this.emsService.getEmpAnnouncements().subscribe((res: any) => {
    if(res && res.status){
      this.announcementsDetails = res.data;
     }
  });
 }
  getEmployeeOnboardingCheckList(){
    // this.emsService.getEmployeeOnboardingCheckList(this.userSession.id,'Onboarding',null).subscribe((res: any) => {
    this.emsService.getEmployeeBoardingCheckList(this.userSession.id,'Onboarding',null).subscribe((res: any) => {
      if(res && res.status){
        this.onboardingDetails=res.data;
        this.count=0;
        for(let i=0;i<this.onboardingDetails.length;i++){
          if(this.onboardingDetails[i].status =='Completed'){
              this.count=this.count+1;

          }
        }

      }
    });
  }

  getallEmployeeProgramSchedules(){
    this.emsService.getallEmployeeProgramSchedules(this.userSession.id,null).subscribe((res: any) => {
      if(res && res.status){
        for(let i=0;i<res.data.length;i++){
          let array = res.data[i].schedule_starttime.split(':')
          res.data[i].schedule_starttime =array[0]+':'+array[1]
        }
        this.inductionProgram=res.data;

        // this.onboardingDetails=res.data;
      }
    });
  }
  getReportingManagerForEmp(){
    this.reportingManager=[];
    this.reportingManagerName='';
    this.emsService.getReportingManagerForEmp(this.userSession.id).subscribe((res: any) => {
      if(res && res.status){
        if(res.data.length>0){
          this.reportingManager = res.data;
          this.reportingManagerName = this.reportingManager[0].managername;
        }


      }
    });
  }

  getHrDetails(){
    this.emsService.getHrDetails().subscribe((res: any) => {
      if(res && res.status){
        this.hrReportingManager=res.data;
      }
    });
  }
  getEmployeeImage() {
    let input = {
      'employeeId': this.userSession.id,
      "candidateId": 0,
      "moduleId": 1,
      "filecategory": 'PROFILE',
      "requestId": null,
      'status': null
    }
    this.mainService.getDocumentsForEMS(input).subscribe((result: any) => {
      if (result.data.length > 0 && result.status) {
                this.profileId = result.data[0].id;
                this.profileInfo = JSON.stringify(result.data[0]);
               this.mainService.getDocumentOrImagesForEMS(result.data[0]).subscribe((imageData) => {
                 if(imageData.success){
                            let TYPED_ARRAY = new Uint8Array(imageData.image.data);
                            const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
                              return data + String.fromCharCode(byte);
                            }, '');
                            let base64String= btoa(STRING_CHAR)
                            this.imageurls[0].base64String='data:image/png;base64,'+base64String;
                          }
                          else{
                            this.isRemoveImage=false;
                            this.imageurls =[{base64String:"assets/img/profile.jpg" }];
                          }
        })
      }
    })
  }
}
