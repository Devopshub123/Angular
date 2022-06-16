import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from './models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  constructor(private router: Router) { }
  gettoken(){  
    return !!localStorage.getItem("SeesionUser");  
    }  
    login(user: User) {
      if (user.userName !== '' && user.password !== '' ) {
        this.loggedIn.next(true);
        this.router.navigate(['/']);
      }
    }
  
    logout() {
      this.loggedIn.next(false);
      this.router.navigate(['/login']);
    }
}
