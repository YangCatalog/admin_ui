import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { first, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hasError = false;
  isLoading = false;

  constructor(private formBuilder: FormBuilder, readonly authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }
    this.isLoading = true;
    this.authService
      .logIn(this.loginForm.value.username, this.loginForm.value.password)
      .pipe(
        first(),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        response => {
          if (response.info === 'Success') {
            this.router.navigate(['/healthcheck']);
            this.authService.setLoggedIn(true);
            this.hasError = false;
          } else {
            this.authService.setLoggedIn(false);
            this.hasError = true;
          }
        },
        err => {
          this.authService.setLoggedIn(false);
          this.hasError = true;
        }
      );
  }
}
