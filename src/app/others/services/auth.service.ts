import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    logged = environment.logged;

    constructor(private router: Router) {}

    logIn(username: string, password: string) {
        if (username === 'admin' && password === 'admin') {
            this.logged = true;
            return true;
        }
        return false;
    }

    logOut() {
        this.logged = false;
        this.router.navigate(['/login']);
    }

    isLoggedIn() {
        return this.logged;
    }

    // // Token has to be stored in local storage
    // isAuthenticated(): boolean {
    //   const token = localStorage.getItem('token');
    //   // Check whether the token is expired and return true or false
    //   return !this.jwtHelper.isTokenExpired(token);
    // }
}
