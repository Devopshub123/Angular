import { Injectable } from '@angular/core';
import { AnyComponent } from 'preact';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {
  private sharedData: any=new Subject<any>();
 
  constructor() { }

  setData(updatedData:any) {
    this.sharedData.next(updatedData);
  }
  getData(): Observable<any> {
    return this.sharedData.asObservable();
  }
}
