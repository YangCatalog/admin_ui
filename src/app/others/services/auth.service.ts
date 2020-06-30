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
    logged = environment.logged;
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
        this.http
            .post<any>(this.logoutRoute, {})
            .pipe(first())
            .subscribe(response => {
                if (response.info === 'Success') {
                    this.logged = false;
                    this.router.navigate(['/login']);
                }
            });
    }

    isLoggedIn() {
        return this.logged;
    }

    setLoggenIn(logged: boolean) {
        this.logged = logged;
    }
}
