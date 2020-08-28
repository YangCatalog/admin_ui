import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from 'src/app/sso.config';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hasError = false;
  isLoading = false;

  constructor(private formBuilder: FormBuilder, readonly authService: AuthService, private oauthService: OAuthService) {
    this.configureSingleSignOn();
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() { }

  configureSingleSignOn() {
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndLogin();
  }

  get token() {
    const claims: any = this.oauthService.getIdentityClaims();
    console.log('Token: ' + claims);
    return claims ? claims : null;
  }
}
