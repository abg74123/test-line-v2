import { BehaviorSubject } from "rxjs";


export class LineService {
    private lineConnect = new BehaviorSubject(null)
    lineConnect$ = this.lineConnect.asObservable()


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