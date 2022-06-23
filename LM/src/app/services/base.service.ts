import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, Subject, BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BaseService {
    public sideNavBar = new BehaviorSubject<any>('');
    public headNavBar = new BehaviorSubject<any>('');
    public subSideNavBar = new BehaviorSubject<any>('');
    public toggleSideBar = new BehaviorSubject<any>('');
    public rolesCookie = new BehaviorSubject<any>('');
    setSideNav(message: string) {
        this.sideNavBar.next(message);
    }

    clearSideNav() {
        this.sideNavBar.next('');
    }

    getSideNav(): Observable<any> {
        return this.sideNavBar.asObservable();
    }
    setHeadNav(message: string) {
        this.headNavBar.next(message);
    }

    clearHeadNav() {
        this.headNavBar.next('');
    }

    getHeadNav(): Observable<any> {
        return this.headNavBar.asObservable();
    }
    setSubSideNav(message: string) {
        this.subSideNavBar.next(message);
    }

    clearSubSideNav() {
        this.subSideNavBar.next('');
    }

    getSubSideNav(): Observable<any> {
        return this.subSideNavBar.asObservable();
    }
    setToggleSideBar(message: string) {
        this.toggleSideBar.next(message);
    }

    clearToggleSideBar() {
        this.toggleSideBar.next('');
    }

    getToggleSideBar(): Observable<any> {
        return this.toggleSideBar.asObservable();
    }
    setRoles(message: string) {
        this.rolesCookie.next(message);
    }

    clearRoles() {
        this.rolesCookie.next('');
    }

    getRoles(): Observable<any> {
        return this.rolesCookie.asObservable();
    }

}
