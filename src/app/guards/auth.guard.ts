import { Injectable } from '@angular/core';
import { Router, CanActivate, } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    
    constructor(
        private router: Router,
        private authService: AuthService) { }

    canActivate(){
        const isLoggedIn = this.authService.isLoggedIn();
        
        if(!isLoggedIn){
            this.router.navigateByUrl('/signin');
            this.authService.removeToken();
            return false;
        }

        return true;
    }
}
