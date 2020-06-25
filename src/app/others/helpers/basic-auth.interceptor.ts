import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add header with basic auth credentials if user is logged in and request is to the api url
        const userData = window.btoa(`${environment.username}:${environment.password}`);

        const isApiUrl = request.url.includes('api/');
        if (isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Basic ${userData}`
                }
            });
        }
        return next.handle(request);
    }
}
