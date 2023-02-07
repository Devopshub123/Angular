import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component,OnInit,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PayrollService } from '../../payroll.service';
import {DatePipe,Location} from "@angular/common";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ])
  ]
})
export class EarningsComponent implements OnInit {
  earningsRequestForm!: FormGroup;
  paygroupRequestForm!: FormGroup;
  expandedElement:any;
  paygroups:any=[];
  paygroupdata:any=[];
  isShowCalculatedAmount: any = '';
  isShowSalaryDayText: boolean = false;
  pageLoading =true;
  displayedColumns: string[] = ['Name', 'Earning_Type','Calculation_Type','Consider_for_EPF','Consider_for_ESI','Status','Action'];
  arrayValue:any=[{Value:'0',name:'Flat Amount'},{Value:'1',name:'Percentage of Basic'}];
  arrayPayValue:any=[{Value:'0',name:'Active'},{Value:'1',name:'Inactive'}];
  dataSource: MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(private location:Location,private router:Router,private formBuilder: FormBuilder,private PR:PayrollService) { 
    this.getpayrollincomegroups();
    this.paygroupdata = this.location.getState();
    console.log(this.paygroupdata)
  }
  ngOnInit(): void {
    this.earningsRequestForm = this.formBuilder.group(
      {
        payGroup: [""],
        componentType:[""],
        namePaySlip:[''],        
        monthly_salary:  [""],
        flat_amount:[""],
        basic_percentage:  [""],       
        status: [""]
      });
      this.status(1)
      this.paygroupRequestForm = this.formBuilder.group(
        {
          paygroupcomponent:[]
        });
      this.paygroupRequestForm.get('paygroupcomponent')?.valueChanges.subscribe(selectedValue => {
        this.getsalarycomponentsforpaygroup(selectedValue)
      })
      if(this.paygroupdata.data.id != undefined){
        this.paygroupdata.data.id != undefined?this.paygroupdata.data.id:'';
        this.paygroupRequestForm.controls.paygroupcomponent.setValue(this.paygroupdata.data.id)
      }

  }
  onRequestClick(){     
    this.router.navigate(["/Payroll/EarningsRequest"],{state: {}}); 
  }
  onViewClick(data:any){
    // console.log(data)
    // data.URL = '/Payroll/Earnings';
    // data.isdashboard = true;
    // this.router.navigate(['/Payroll/EarningsRequest'],{state:{EarningData:data}});
  }
  edit(data:any){
    if(data.section=='Earnings'){
      this.router.navigate(['/Payroll/EarningsRequest'],{state:{Earndata:data,paygroupdata:this.paygroupdata}});
    }   
  }
  setPayGroup(){}
  cancel(){}
  /**selected PayGroup components details  */
  getsalarycomponentsforpaygroup(id:any){
    let data ={
      id: id
    }
    this.PR.getsalarycomponentsforpaygroup(data).subscribe((info:any)=>{
      if(info.status && info.data.length !=0) {
        this.dataSource = new MatTableDataSource(info.data);
        console.log(info.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (info.data.length > 20) {
          this.pageLoading = false;
        }
      }
    })

  }
  /**PayGroup list for dropdown  */
  getpayrollincomegroups(){
    this.PR.getpayrollincomegroups().subscribe((info:any)=>{
      if(info.status && info.data.length !=0) {
        this.paygroups = info.data;
      }
    })

  }

  getPageSizes(): number[] {
     
  var customPageSizeArray = [];
  if (this.dataSource.data.length > 5) {
    customPageSizeArray.push(5);
  }
  if (this.dataSource.data.length > 10) {
    customPageSizeArray.push(10);
  }
  if (this.dataSource.data.length > 20) {
    customPageSizeArray.push(20);
  }
  customPageSizeArray.push(this.dataSource.data.length);
  return customPageSizeArray;
  }
  /**For flat or percentage input type*/
  status(status:any){
   if(status == '0')
    {
       this.isShowCalculatedAmount = "Flat Amount" 
    }
    else if(status == '1')
    {
       this.isShowCalculatedAmount = "basicPercentage" 
    }
  }
  Back(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Payroll/PayGroup"]));
    
  }
}
