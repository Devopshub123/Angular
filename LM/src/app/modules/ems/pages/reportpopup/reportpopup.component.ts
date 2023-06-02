import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder,FormArray, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmsService } from '../../ems.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reportpopup',
  templateUrl: './reportpopup.component.html',
  styleUrls: ['./reportpopup.component.scss']
})
export class ReportpopupComponent implements OnInit {
  earningData = [
    { id: 1, name: 'Employee Status' },
    { id: 2, name: 'Employee Type' },
    { id: 3, name: 'Department' },
    { id: 4, name: 'Designation' },
    { id: 5, name: 'Location' },
    { id: 6, name: 'Gender' },
    { id: 7, name: 'Blood Group' },
    { id: 7, name: 'Marital Status' },
    { id: 9, name: 'Shifts' },
    { id: 10, name: 'Reporting Manager' },
  ];
  userSession:any;
  get earningsFormArray() {
    return this.reportpopupForm.controls.earnings as FormArray;
  }
  reportpopupForm:any= FormGroup;
  status!:boolean;
  data:any=[];
  constructor(
    public dialogRef: MatDialogRef<ReportpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string,private ES:EmsService,private router: Router,private formBuilder: FormBuilder) {
      this.reportpopupForm=this.formBuilder.group({
        earnings: new FormArray([]),
      });
      this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
      this.addCheckboxes();
      this.getEmsEmployeeColumnConfigurationValue();
     }
  onNoClick(): void {
    this.dialogRef.close();

  }
  ngOnInit() {


  }
  private addCheckboxes() {
    this.earningData.forEach(() => this.earningsFormArray.push(new FormControl(false)));
  }


  getEmsEmployeeColumnConfigurationValue(){
    this.ES.getEmsEmployeeColumnConfigurationValue(this.userSession.id).subscribe((result:any)=>{
      this.data = result.data;
      let arr = JSON.parse(JSON.stringify(result.data[0].configurations)).split(',')
      this.earningsFormArray.setValue([Number(arr[0]),Number(arr[1]),Number(arr[2]),Number(arr[3]),Number(arr[4]),Number(arr[5]),Number(arr[6]),Number(arr[7]),Number(arr[8]),Number(arr[9])])
    })

  }
  save(){
    console.log("earningselectedIdsfkjdkjghsjkghh")
    const earningselectedIds = this.reportpopupForm.value.earnings
      .map((checked:any, i:any) => checked ? 1 : 0)
      .filter((v:any) => v !== null);
      console.log("earningselectedIds,",earningselectedIds)
      let data = {
        empid:this.userSession.id,
        employee_status_value:(earningselectedIds[0]),
        employee_type:(earningselectedIds[1]),
        department_value:(earningselectedIds[2]),
        designation_value:(earningselectedIds[3]),
        location_value:(earningselectedIds[4]),
        gender_value:(earningselectedIds[5]),
        blood_group_value:(earningselectedIds[6]),
        marital_status_value:(earningselectedIds[7]),
        shift_value:(earningselectedIds[8]),
        reporting_manager_value:(earningselectedIds[9])
        }
        this.ES.setEmsEmployeeColumnConfigurationValues(data).subscribe((res:any)=>{
          if(res.status){
            this.dialogRef.close();
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/ems/emloyee-report"]));

          }


        })


      }


}
