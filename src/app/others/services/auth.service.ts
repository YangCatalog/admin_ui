import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
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

    constructor(private router: Router, private http: HttpClient) {}

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
                    if (response.info === 'Success') {
                        this.deleteCookie('session');
                        this.router.navigate(['/login']);
                        this.logged = false;
                    }
                });
        }
    }

    isLoggedIn() {
      // Check if cookie already exists
      this.logged = document.cookie.split(';').some(cookie => cookie.startsWith('session'));
      return this.logged;
    }

    setLoggedIn(logged: boolean) {
        this.logged = logged;
    }

    private deleteCookie(cookieName: string) {
        document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
    }
}
