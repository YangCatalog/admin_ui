import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService) { }

  canActivate(): Promise<boolean> {
    return this.canLoad();
  }

  canLoad(): Promise<boolean> {
    return this.authService.oidcLogin();
  }
}
