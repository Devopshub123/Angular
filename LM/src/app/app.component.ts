
import { Component, OnInit,ChangeDetectorRef,OnDestroy } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { NavItem } from './models/navItem';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'boon-hrms';
  
constructor(public router:Router) {

}
ngOnInit(): void {
}


}