import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { Role, User } from './models';
import jwt_decode from 'jwt-decode';
import { PageName } from './app.module';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const token = this.authenticationService.token;
        if (token) {
            const user = jwt_decode<User>(token);
            const roles: Role[] = route.data?.roles;
            if (roles && roles.indexOf(user.role) < 0) {
                this.router.navigate(['/']);
                return false;
            }
            return true;
        }

        this.router.navigate([PageName.LOGIN]);
        return false;
    }

}
