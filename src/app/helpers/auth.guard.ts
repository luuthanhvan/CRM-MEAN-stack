import { Injectable } from '@angular/core';
import { Router, CanActivate, } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    
    constructor(
        private router: Router,
        private authService: AuthService) { }

    canActivate(){
        const authInfo = this.authService.getAuthData;

        if(authInfo){
            return true;
        }

        this.router.navigate(['/signin']);
        return true;
    }
}
