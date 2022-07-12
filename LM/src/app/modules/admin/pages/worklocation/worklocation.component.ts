import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PopupComponent,PopupConfig } from '../../../../pages/popup/popup.component';
import { MatDialog } from '@angular/material/dialog'; 
import { OnlyNumberDirective } from 'src/app/custom-directive/only-number.directive';
import { LoginService } from 'src/app/services/login.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface UserData {
  total:number;
  address1: string,
  address2: string,
  branchcode: string,
  city: string,
  cityname: string,          
  country:string,
  currentvalue: number,
  id: number,
  location:string,
  pincode:number,
  prefix:string,
  seed:number,
  state: string,
  status:string,

}
@Component({
  selector: 'app-worklocation',
  templateUrl: './worklocation.component.html',
  styleUrls: ['./worklocation.component.scss']
})
export class WorklocationComponent implements OnInit {
  worklocationForm:any= FormGroup;
  CountryDetails:any=[]
  workLocationDetails:any=[]
  stateDetails:any=[]
  CityDetails:any=[]
  worklocationdata:any=[]
  ischeckprefix:boolean=false;
  isViewSeed:boolean=false;
  isnote:boolean=false;
  isdata:boolean=true;
  isadd:boolean=false;
  isview:boolean=false;
  editworklocation:boolean=false;
  
  displayedColumns: string[] = ['city-branch','prefix','seed','status','Action'];
  departmentData:any=[];
  arrayValue:any=[{Value:'Active',name:'Active '},{Value:'Inactive',name:'Inactive'}];
  dataSource: MatTableDataSource<UserData>=<any>[];


  constructor(private formBuilder: FormBuilder,private router: Router,private LM:CompanySettingService,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getWorkLocation();
    this.getCountry();
    
    this.worklocationForm=this.formBuilder.group(
      {
      address1: ["",],        
      address2: ["",],
      branch: ["",],
      country: ["",Validators.required],
      state: ["",Validators.required],
      city: ["",Validators.required],
      pincode: ["",],
      prefix: ["",],        
      seed: ["",Validators.required],
      id:[""],
      
    });
    
    
    this.worklocationForm.get('country')?.valueChanges.subscribe((selectedValue: any)  => {
      this.stateDetails= [];
      this.LM.getStatesc(selectedValue).subscribe((data)=>{
        this.stateDetails=data[0];
        if(this.worklocationdata != null)
        {
          this.worklocationForm.controls.state.setValue(this.worklocationdata.state);
        }
      })
      
    })
    /**get city details for residance address */
    this.worklocationForm.get('state')?.valueChanges.subscribe((selectedValue: any) => {
      this.CityDetails=[];
      this.LM.getCities(selectedValue).subscribe((data)=>{
        this.CityDetails=data[0]
        if(this.worklocationdata != null)
        {
          this.worklocationForm.controls.city.setValue(this.worklocationdata.city);
        }
      })
    })
    this.worklocationForm.get('prefix')?.valueChanges.subscribe((selectedValue: any) => {
      this.isViewSeed = false;
      this.isnote = false;
      if(selectedValue != "") {
        for (var i = 0; i < this.workLocationDetails.length; i++) {
          if (this.workLocationDetails[i].prefix == selectedValue) {
            this.worklocationForm.controls.seed.setValue(this.workLocationDetails[i].seed)
            this.ischeckprefix=true;
            this.isViewSeed=true;
            this.worklocationForm.controls.seed.disable();
            this.isnote = true;
            break;
          } 
          else {           
            this.worklocationForm.controls.seed.setValue("")
            // this.isViewSeed=false;
            this.worklocationForm.controls.seed.enable();
            this.isnote=false;
            this.ischeckprefix=true;
            // valid = true;
          }
  
        }
      }else{
        for(let i=0 ; i<this.workLocationDetails.length;i++){
          if (this.workLocationDetails[i].prefix == selectedValue) {
            this.worklocationForm.controls.seed.setValue(this.workLocationDetails[i].seed)
            this.ischeckprefix=true;
            this.worklocationForm.controls.seed.disable();
            this.isnote = true;
            break;
          }
  
        }
  
      }
      // return this.isViewSeed;
      // return this.ischeckprefix;
    
    })    
  }
  emptyprefix(){
    console.log(this.worklocationForm.controls.prefix.value)
    if(this.worklocationForm.controls.prefix.value==""){
      for (var i = 0; i < this.workLocationDetails.length; i++) {
        if (this.workLocationDetails[i].prefix == '') {
          this.worklocationForm.controls.seed.setValue(this.workLocationDetails[i].seed)
          this.ischeckprefix=true;
          this.isViewSeed=true;
          this.worklocationForm.controls.seed.disable();
          this.isnote = true;
          break;
        } 
      }
      // return this.isViewSeed;
      this.worklocationForm.controls.seed.disable();
      // return this.ischeckprefix;
    }
  }
  getWorkLocation(){
    // this.spinner.show();
    this.LM.getWorkLocation({id:null,companyName:'nandyala_hospitals'}).subscribe((result)=>{
      this.workLocationDetails=result.data;
      this.emptyprefix();
      this.dataSource=new MatTableDataSource(this.workLocationDetails);
      console.log(this.workLocationDetails)
    })
  }
  edit(data:any){
  
     this.editworklocation = true;
     this.worklocationdata = data;
     this.isadd=true;
     this.isdata=false;
     this.isview=false;
     this.worklocationForm.controls.id.setValue(data.id)
     this.worklocationForm.controls.address1.setValue(data.address1)      
     this.worklocationForm.controls.address2.setValue(data.address2)   
     this.worklocationForm.controls.branch.setValue(data.location)    
     this.worklocationForm.controls.country.setValue(data.country)    
     this.worklocationForm.controls. state.setValue(data.state)     
     this.worklocationForm.controls.city.setValue(data.city)   
     this.worklocationForm.controls.pincode.setValue(data.pincode)    
     this.worklocationForm.controls.prefix.setValue(data.prefix)         
     this.worklocationForm.controls.seed.setValue(data.seed)    
  }
  view(data:any){
    this.worklocationdata = data;
    this.isadd=true;
    this.isdata=false;
    this.isview=true;
    
    this.worklocationForm.controls.country.setValue(data.country)  
    this.worklocationForm.controls.address1.setValue(data.address1)      
    this.worklocationForm.controls.address2.setValue(data.address2)   
    this.worklocationForm.controls.branch.setValue(data.location)    
      
    this.worklocationForm.controls. state.setValue(data.state)     
    this.worklocationForm.controls.city.setValue(data.city)   
    this.worklocationForm.controls.pincode.setValue(data.pincode)    
    this.worklocationForm.controls.prefix.setValue(data.prefix)         
    this.worklocationForm.controls.seed.setValue(data.seed) 

    this.worklocationForm.controls.address1.disable();      
     this.worklocationForm.controls.address2.disable();  
     this.worklocationForm.controls.branch.disable();   
    //  this.worklocationForm.controls.country.disable();   
    //  this.worklocationForm.controls. state.disable();   
    //  this.worklocationForm.controls.city.disable();   
     this.worklocationForm.controls.pincode.disable();    
     this.worklocationForm.controls.prefix.disable();        
     this.worklocationForm.controls.seed.disable();
     this.isnote=false;

  }
  Add(){
    this.isadd=true;
    this.isdata=false;
    this.isview=false;
  }
  getCountry(){
    this.LM.getCountry('countrymaster',null,1,10,'nandyala_hospitals').subscribe((data)=>{
      this.CountryDetails=data.data;
      console.log(data)
    })
  }
  status(status:any,id:any){
    
    let data = {
    checktable:'companyworklocationsmaster',
    tableName:'employee_worklocations',
    columnName :'locationid',
    id:id,
    status:status
    }
    this.LM.updateStatusall(data).subscribe((result)=> {
      console.log(result)
      if(result.status){
        this.ngOnInit();
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Worklocation status updated successfully'
        });

      }else{
        this.ngOnInit();
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'This worklocation have active employees. So we are unable to inactivate this worklocation now. Please move those employee to another worklocation and try again'
        });
      }
    })
  }
  submit(){
    if(this.worklocationForm.valid){
      let data ={
        id:this.worklocationForm.controls.id.value,
        address1:this.worklocationForm.controls.address1.value,
        branchCode:'',
        address2:this.worklocationForm.controls.address2.value,
        location:this.worklocationForm.controls.branch.value,
        pincode:this.worklocationForm.controls.pincode.value,
        city:this.worklocationForm.controls.city.value,
        state:this.worklocationForm.controls.state.value,
        country:this.worklocationForm.controls.country.value,
        prefix:this.worklocationForm.controls.prefix.value,
        seed:this.worklocationForm.controls.seed.value,
        status:'Active'    
            
      }
      console.log(data)
      
      this.LM.setWorkLocation(data).subscribe((data) => {
     
                /**For edit worklocation */
                if(this.editworklocation){
                  if(data.status){ 
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                    this.router.navigate(["/Admin/Worklocation"]));  
             
                    this.ngOnInit(); 
                    let dialogRef = this.dialog.open(ReusableDialogComponent, {
                      position:{top:`70px`},
                      disableClose: true,
                      data: 'Worklocation updated successfully'
                    });
                   }
                   else{
                    
                    let dialogRef = this.dialog.open(ReusableDialogComponent, {
                      position:{top:`70px`},
                      disableClose: true,
                      data: 'Unable to update worklocation'
                    });
                   }
                  
                           
                          
        
                }
                /**For add worklocation */
                else{
                  if(data.status){
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                    this.router.navigate(["/Admin/Worklocation"]));
                      
                    this.ngOnInit();
                    let dialogRef = this.dialog.open(ReusableDialogComponent, {
                      position:{top:`70px`},
                      disableClose: true,
                      data: 'Worklocation added successfully'
                    });  
                           
                  }
                  else{
                    let dialogRef = this.dialog.open(ReusableDialogComponent, {
                      position:{top:`70px`},
                      disableClose: true,
                      data: 'Unable to insert worklocation'
                    });
                   }
                  
        
                }

      });

    }

  }
  cancel(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/Worklocation"]));
  }
  close(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/Worklocation"]));
  }
}