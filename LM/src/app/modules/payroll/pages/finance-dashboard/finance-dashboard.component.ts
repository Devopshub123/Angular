import { Component,ViewChild, OnInit } from '@angular/core';
// import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { ChartComponent } from 'angular2-chartjs';
import { PayrollService } from '../../payroll.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CompanySettingService } from 'src/app/services/companysetting.service';


@Component({
  selector: 'app-finance-dashboard',
  templateUrl: './finance-dashboard.component.html',
  styleUrls: ['./finance-dashboard.component.scss']
})
export class FinanceDashboardComponent implements OnInit {
	defaultElevation = 2;
	raisedElevation = 8;
	financeDashboardForm!: FormGroup;

  @ViewChild(ChartComponent)
  chart!: ChartComponent;
	type:any;
	data:any;
	options:any;
	grosssalary: any;
	netSalary: any;
	empcount: any;
	deductions: any;
	EPF: any;
	pftax: any;
	departments:any=[];
	departmentsdata:any=[];
	availableDepartments: any;
	monthsdata:any=[];
	userSession:any;
	financeyears:any;
	monthdetails:any;
	Selmonth:any;
	Selyear:any;
	SelDisplay:any
	dbname:any;
  constructor(private PR:PayrollService,private LMS: CompanySettingService,private formBuilder: FormBuilder) { 
	this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
	this.dbname =sessionStorage.getItem('companyName')
    this.getFinancialYears();
	
	this.getDepartmentsMaster();
	
  }
  displayedColumns: string[] = ['Loan_Type', 'Employee_Count'];
  dataSource :any;
  ngOnInit(): void {
	console.log("hi")
	this.financeDashboardForm = this.formBuilder.group(
		{
		  dept:  ['null'],
		  month:[this.monthdetails]
		});
	
	
		this.getMonthlyPayrollData();
		this.financeDashboardForm.get('dept')?.valueChanges.subscribe((selectedValue:any) => {
			console.log(selectedValue);
			this.getMonthlyPayrollData();
			this.getMonthlyPayrollDataForGraph();
		});
		this.financeDashboardForm.get('month')?.valueChanges.subscribe((selectedValue:any) => {
			this.Selmonth=selectedValue.month_value;
			this.Selyear=selectedValue.year_value;
			this.SelDisplay=selectedValue.display_value;
			this.getMonthlyPayrollData();
			this.getMonthlyPayrollDataForGraph();
			
		})

   
//   this.options ={
// 	scales: {
// 		yAxes: {
// 		  beginAtZero: true
// 		},
// 		xAxes: {
// 			beginAtZero: true
// 		  },
// 		  ticks: {
// 			min: 0,
// 			stepSize: 1,
// 			fixedStepSize: 1,
// 		}
// 	  }

//   }
  

 

  } 
  getDepartmentsMaster() {
    this.LMS.getMastertable('departmentsmaster', 1, 1, 1000, this.dbname).subscribe(data => {
      this.availableDepartments = data.data;
	  console.log(this.availableDepartments )
    })
  }
  getMonthlyPayrollData(){
	this.grosssalary = '';
		 this.netSalary = '';
		 this.empcount = '';
		 this.deductions = '';
		 this.pftax = '';
		 this.EPF = '';
		let data ={
			month:this.Selmonth,
			year:this.Selyear,
			deptid:this.financeDashboardForm.controls.dept.value
		}

	
	
	console.log("data",data)
	this.PR.getMonthlyPayrollData(data).subscribe((result:any)=>{
		console.log("rrr",result.data)
		
		if(result.status){
		 console.log("result",result.data[0])
		 this.grosssalary = result.data[0].gross_salary;
		 this.netSalary = result.data[0].net_salary;
		 this.empcount = result.data[0].employee_count;
		 this.deductions = result.data[0].total_deductions;
		 this.pftax = result.data[0].professional_tax;
		 this.EPF = result.data[0].epf;
		}
	   
	  })
  }
  getMonthlyPayrollDataForGraph(){
	let data ={
		month:Number(this.Selmonth),
		year:Number(this.Selyear)
	}
	this.PR.getMonthlyPayrollDataForGraph(data).subscribe((result:any)=>{
		console.log("rrr",result)
		this.departments=[];
		this.departmentsdata=[];
		if(result.status){
		 console.log("result",result.data[0])
		 console.log("deppp",result.data[0].deptname)
		 for(let i=0;i<result.data.length;i++){
			this.departments.push(result.data[i].deptname);
			this.departmentsdata.push(result.data[i].sum)
		 }
		 console.log("depat",this.departments);
	  console.log("deptdata",this.departmentsdata)
	  
		 this.type = 'horizontalBar';
		 this.data = {
			 // labels: ["It service", "Finance", "HR", "Sales", "Marketing"],
			 labels: this.departments,
			 datasets: [
				 {
					 fill: true,
					 label: "Departments",
					 backgroundColor: [" #28acaf", " #28acaf", " #28acaf", " #28acaf", " #28acaf"],
					 // data: [100, 12, 6, 11, 7]
					 data:this.departmentsdata
				 }
			 ]
		 }
		 this.options = {			
			 scales:{
					 yAxes: [{						
						 gridLines: {
							 beginAtZero: true,
							 display: false
						 },
						 ticks: {
							 min: 0,
							 stepSize: 1,
							 fixedStepSize: 1,
						 }
					 }],
					 // xAxes: [{
					 // 	beginAtZero: true,
					 // 	display: false,
					 // 	gridLines: {
					 // 		display: false
					 // 	},
					 // 	ticks: {
					 // 		min: 0,
					 // 		stepSize: 1,
					 // 		fixedStepSize: 1,
					 // 	}
					 // }],
				 }
	 
   }
   
		}
		else{
			this.departments=[];
		this.departmentsdata=[];
		this.data=[];

		}
	   
	  })
	  
	


  }
    /** getFinancialYears Data*/
	getFinancialYears(){
		this.PR.getFinancialYears().subscribe((result:any)=>{
		  if(result.status && result.data.length>0){
			console.log("financeyears",result.data[0].financial_year)
			this.financeyears = result.data[0].financial_year;
			this.getEmployeePayslips();
		  }
		  else{
			this.financeyears=[]
		  }
		})
	  }
      /**getEmployeePayslips */
	  getEmployeePayslips(){
		let data={
		  fyear:this.financeyears,
		}
		this.PR.Month_Year(data.fyear).subscribe((result:any)=>{
		  if(result.status&&result.data.length>0){
			this.monthsdata =result.data;
			for(let i=0;i<this.monthsdata.length;i++){
				if(this.monthsdata[i].month_value == Number(new Date().getMonth())+1){
					this.monthdetails = this.monthsdata[i];
					this.financeDashboardForm.controls.month.setValue(this.monthsdata[i])
					this.Selmonth=this.monthsdata[i].month_value
					this.Selyear=new Date().getFullYear();
					this.SelDisplay=this.monthsdata[i].display_value;
					this.getMonthlyPayrollDataForGraph();
					break;
					

				}
				
			}
		  }
		  else{
			this.monthdetails=[];
			this.Selmonth=''
			this.Selyear='';
			this.SelDisplay='';
		  }
		})
	  }
}
