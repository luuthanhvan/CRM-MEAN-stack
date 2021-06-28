import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class OnlyAdminUsersGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    canActivate(){
        const currentUser = this.authService.getUser;
        return !!currentUser.isAdmin;
    }
}