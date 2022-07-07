
import { Component, OnInit,ChangeDetectorRef,OnDestroy } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { NavItem } from './models/navItem';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'boon-hrms';

constructor(public router:Router,private bnIdle: BnNgIdleService) {

}
ngOnInit(): void {
  this.bnIdle.startWatching(3600000000).subscribe((res) => {
    if (res) {
     this.router.navigate(['/Login'])
    }
  });
}


}
