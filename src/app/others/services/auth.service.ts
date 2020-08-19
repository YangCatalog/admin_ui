import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logged = false;
  private loginRoute = `/api/admin/login`;
  private logoutRoute = `/api/admin/logout`;
  private pingRoute = `/api/admin/ping`;

  constructor(private router: Router, private http: HttpClient) { }

  logIn(username: string, password: string): Observable<any> {
    const payload = {
      input: {
        username,
        password
      }
    };
    return this.http.post<any>(this.loginRoute, payload);
  }

  logOut() {
    if (this.logged) {
      this.http
        .post<any>(this.logoutRoute, {})
        .pipe(first())
        .subscribe(response => {
          this.deleteCookie('session');
          this.router.navigate(['/login']);
          this.logged = false;
        });
    }
  }

  pingSession(pageGuard: string) {
    const promise = new Promise<boolean>((resolve, reject) => {
      this.http
        .get(this.pingRoute)
        .toPromise()
        .then(
          (res: any) => {
            this.logged = res.info === 'Success';
            if (pageGuard === 'auth') {
              this.router.navigate(['/healthcheck']);
              resolve(!this.logged);
            } else {
              resolve(this.logged);
            }
          },
          err => {
            if (pageGuard === 'auth') {
              this.logged = false;
              resolve(!this.logged);
            } else {
              this.router.navigate(['/login']);
              this.logged = false;
              resolve(this.logged);
            }
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
