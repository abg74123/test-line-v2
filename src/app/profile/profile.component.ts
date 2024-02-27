import { Component, OnInit } from '@angular/core';
import { LineService } from '../core/services/line.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, mergeMap, tap } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile$ = new BehaviorSubject(null)
  prefixLine = "https://access.line.me/oauth2/v2.1/authorize"
  redirectUri = "https://boss-lineauth.netlify.app/profile"

  constructor(
    private line:LineService,
    private route:ActivatedRoute,
    private router:Router,
    private http:HttpClient
    ) { }

  ngOnInit(): void {
    console.log(this.route.snapshot.queryParams)
    console.log("getLineConnect => ",this.line.getLineConnect)
    const {code, state} = this.route.snapshot.queryParams

    if(!code || !state){
      const {channelId} = this.line.getLineConnect
      const url = `${this.prefixLine}?response_type=code&client_id=${channelId}&redirect_uri=${this.redirectUri}&state=12345abcde&scope=profile%20openid&nonce=09876xyz`
      window.location.href = url
    }else{
      const {channelId,channelSecretId} = this.line.getLineConnect

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');

      let body = new HttpParams();
      body = body.set('grant_type', 'authorization_code');
      body = body.set('code', code);
      body = body.set('client_id', channelId);
      body = body.set('client_secret', channelSecretId);
      body = body.set('redirect_uri', "https://boss-lineauth.netlify.app/profile");

      this.http.post(`https://api.line.me/oauth2/v2.1/token`,body,{headers}).pipe(
        mergeMap((res:any) => {
          return this.http.post(`https://api.line.me/oauth2/v2.1/verify?id_token=${res.id_token}&client_id=${channelId}`,{}).pipe(
            tap((profile:any) => this.profile$.next(profile))
          )
        })
      ).subscribe()
    }
  
  }


}
