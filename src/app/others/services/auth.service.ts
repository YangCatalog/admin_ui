import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logged = false;
  readonly loginRoute = `/api/admin/login`;
  private logoutRoute = `/api/admin/logout`;
  private pingRoute = `/api/admin/check`;

  constructor(private router: Router, private http: HttpClient) { }

  logOut() {
    if (this.logged) {
      this.http
        .post<any>(this.logoutRoute, {})
        .pipe(first())
        .subscribe(response => {
          this.deleteCookie('session');
          this.deleteCookie('oidc_token');
          window.location.pathname = '/';
          this.logged = !(response.info === 'Success');
        });
    }
  }

  checkUserSession() {
    const promise = new Promise<boolean>((resolve, reject) => {
      this.http
        .get(this.pingRoute)
        .toPromise()
        .then(
          (response: any) => {
            this.logged = response.info === 'Success';
            resolve(this.logged);
          },
          err => {
            window.location.pathname = this.loginRoute;
            this.logged = false;
            resolve(this.logged);
          }
        );
    });
    return promise;
  }

  setLoggedIn(logged: boolean) {
    this.logged = logged;
  }

  private deleteCookie(cookieName: string) {
    document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
  }
}
