import {HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, mergeMap, tap, throwError} from "rxjs";
import {Injectable} from '@angular/core'
import {LineService} from "./line.service";

export interface IVerifyTokenId {
  id_token: string;
  channelId: string;
}

export interface IGetToken {
  code: string;
  channelId: string;
  channelSecretId: string;
}

export interface IGetProfile {
  channelId: string;
  channelSecretId: string;
  code: string;
}

@Injectable({
  providedIn: 'root',
})

export class AuthService extends LineService {

  prefixLine = "https://access.line.me/oauth2/v2.1/authorize"
  redirectUri = "http://localhost:4200/profile"

  get getAccessToken() {
    localStorage.getItem('connect')
    const {channelId} = this.getLineConnect
    return localStorage.getItem(`GAPP_STORE:${channelId}:accessToken`)
  }

  get getClientId() {
    localStorage.getItem('connect')
    const {channelId} = this.getLineConnect
    return localStorage.getItem(`GAPP_STORE:${channelId}:clientId`)
  }

  get getIDToken() {
    localStorage.getItem('connect')
    const {channelId} = this.getLineConnect
    return localStorage.getItem(`GAPP_STORE:${channelId}:IDToken`)
  }

  authLogin(channelId: string) {
    const url = `${this.prefixLine}?response_type=code&client_id=${channelId}&redirect_uri=${this.redirectUri}&state=12345abcde&scope=profile%20openid&nonce=09876xyz`
    console.log("Url Line Login => ", url)
    window.location.href = url
  }

  getToken(p: IGetToken) {
    // ^ config header
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    // ^ config body
    let body = new HttpParams();
    body = body.set('grant_type', 'authorization_code');
    body = body.set('code', p.code);
    body = body.set('client_id', p.channelId);
    body = body.set('client_secret', p.channelSecretId);
    body = body.set('redirect_uri', this.redirectUri);

    return this.http.post(`https://api.line.me/oauth2/v2.1/token`, body, {headers}).pipe(
      tap((auth: any) => {
        // ^ Create Store
        localStorage.setItem(`GAPP_STORE:${p.channelId}:accessToken`, auth.access_token)
        localStorage.setItem(`GAPP_STORE:${p.channelId}:clientId`, p.channelId)
        localStorage.setItem(`GAPP_STORE:${p.channelId}:IDToken`, auth.id_token)
      })
    )
  }

  verifyTokenId(p: IVerifyTokenId) {
    return this.http.post(`https://api.line.me/oauth2/v2.1/verify?id_token=${p.id_token}&client_id=${p.channelId}`, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        // ^ Handle error here
        console.error('An error occurred:', error);
        // ^ Remove Store
        const {channelId} = this.getLineConnect
        localStorage.removeItem(`GAPP_STORE:${channelId}:accessToken`)
        localStorage.removeItem(`GAPP_STORE:${channelId}:clientId`)
        localStorage.removeItem(`GAPP_STORE:${channelId}:IDToken`)
        // ^ Redirect to error page
        this.router.navigate(['profile']);
        // ^ Pass the error to the calling code
        return throwError(error);
      })
    )
  }

  getProfile(p: IGetProfile) {
    // ? Get ID Token from localStorage
    if (this.getIDToken) {
      // * body send to verify
      const bodyVerifyTokenid: IVerifyTokenId = {channelId: p.channelId, id_token: this.getIDToken}
      return this.verifyTokenId(bodyVerifyTokenid)
    } else {
      // * body send to get token
      const bodyGetToken: IGetToken = {channelId: p.channelId, channelSecretId: p.channelSecretId, code: p.code}
      return this.getToken(bodyGetToken).pipe(
        mergeMap(res => {
          // * body send to verify
          const bodyVerifyTokenid: IVerifyTokenId = {channelId: p.channelId, id_token: res.id_token}
          return this.verifyTokenId(bodyVerifyTokenid)
        })
      )
    }
  }

  handleError(e: any) {
    console.log("handleError => ", e)
    this.router.navigate(['profile']);
    const {channelId} = this.getLineConnect
    // ^ Remove Store
    localStorage.removeItem(`GAPP_STORE:${channelId}:accessToken`)
    localStorage.removeItem(`GAPP_STORE:${channelId}:clientId`)
    localStorage.removeItem(`GAPP_STORE:${channelId}:IDToken`)
    console.log("After Remove Store => ", e)
    // * redirect to line login
    this.authLogin(channelId)
    return e
  }
}
