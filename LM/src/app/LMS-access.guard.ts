import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree ,Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LMSAccessGuard implements CanActivate {
  constructor(public route : Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if(sessionStorage.getItem('user')){
      return true;
    }
    else {
      this.route.navigate(['Login'])
        return false;
    }
  }
  
}
