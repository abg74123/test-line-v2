import { BehaviorSubject } from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})

export class LineService {
    private lineConnect = new BehaviorSubject(null)
    lineConnect$ = this.lineConnect.asObservable()

  constructor(public http:HttpClient,public router: Router) {
  }

    set setLineConnect(connect:any){
         this.lineConnect.next(connect)
         localStorage.setItem('connect',JSON.stringify(connect))
    }

    get getLineConnect():any{
        console.log(localStorage.getItem('connect'))
        if(localStorage.getItem('connect')){
            this.lineConnect.next(JSON.parse(localStorage.getItem('connect') as any))
        }
        return this.lineConnect.getValue()
    }

}
