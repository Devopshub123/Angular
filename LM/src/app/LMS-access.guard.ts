import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree ,Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LMSAccessGuard implements CanActivate {
  constructor(public route : Router){}
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot) {
  //   if(sessionStorage.getItem('user')){
  //     return true;
  //   }
  //   else {
  //     this.route.navigate(['Login'])
  //       return false;
  //   }
  // }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    var urlsList:any=[]
    var module: any = JSON.parse(sessionStorage.getItem('moduleData') ?? '[]');
  //   if (module.length > 0) {
  //     module.forEach((e: any) => {
  //       if (e.menu_items.length>0) {
  //         e.menu_items.forEach((item: any) => {
  //           urlsList.push({
  //             "routeurl": item.routename
  //           });
  //         });
  //       }
  //     });
  //   }
  //   else {
  //  }
    if (sessionStorage.getItem('user')) {
      return true;
      // if (urlsList.length > 0) {
      //   const toSelect = urlsList.find((url: any) => url.routeurl.trim() == state.url);
      //    if (toSelect != undefined) {
      //     return true;
      //   } else {
      //     this.route.navigate(['Login'])
      //     return false;
      //   } 

      // } else {
      //   this.route.navigate(['Login'])
      //   return false;
      // }
    }
    else {
      this.route.navigate(['Login'])
        return false;
    }
  }
  
  
}
