import { Component, OnInit } from '@angular/core';
import { LineService } from '../core/services/line.service';
import { ActivatedRoute } from '@angular/router';
import {AuthService, IGetProfile} from "../core/services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  lineConnect = this.line.getLineConnect
  accessToken = this.auth.getAccessToken
  clientId = this.auth.getClientId
  idToken = this.auth.getIDToken

  profile$:any


  constructor(
    private line:LineService,
    private route:ActivatedRoute,
    private auth:AuthService
    ) { }

  ngOnInit(): void {
    console.log(this.route.snapshot.queryParams)
    console.log("getLineConnect => ",this.line.getLineConnect)
    const {code, state} = this.route.snapshot.queryParams

    // ? Check has login?
    if(code && state){
      // * Get Profile
      const {channelId,channelSecretId} = this.line.getLineConnect
      const bdGetProfile:IGetProfile = {channelId,channelSecretId,code}
      this.profile$ = this.auth.getProfile(bdGetProfile)
    }else{
      // * redirect to line login
      const {channelId} = this.line.getLineConnect
      this.auth.authLogin(channelId)
    }

  }


}
