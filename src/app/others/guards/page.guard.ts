import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PageGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Promise<boolean> {
    return this.canLoad();
  }

  canLoad(): Promise<boolean> {
    return this.authService.checkUserSession();
  }
}
