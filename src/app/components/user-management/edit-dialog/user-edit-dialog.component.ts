import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router'
import { UserManagementService } from '../../../services/user_management/user-management.service';

@Component({
    selector: 'edit-user-dialog',
    templateUrl: 'user-edit-dialog.component.html'
})
export class EditUserDialog implements OnInit{
    userFormInfo: FormGroup;
    userId : string;
    createdTime : string;
    submitted = false;

    constructor(protected router: Router,
                private userService : UserManagementService){
        
        this.userFormInfo = this.userService.initUser();
    }
    
    ngOnInit(){
        // load user information to the user form
        this.userService
            .getUser(this.userId)
            .subscribe((data) => {
                this.userFormInfo.setValue({
                    name: data.name,
                    username: data.username,
                    password: data.password,
                    confirmPassword: data.password,
                    email: data.email,
                    phone: data.phone,
                    isAdmin: data.isAdmin,
                    isActive: data.isActive,
                });
                this.createdTime = data.createdTime; // to keep the created time when update a user
            });
    }

    get contactFormControl(){
        return this.userFormInfo.controls;
    }

    onUpdate(form: FormControl){
        this.submitted = true;
        let userInfo = form.value;
        userInfo.createdTime = this.createdTime;
        
        this.userService
            .updateUser(this.userId, userInfo)
            .subscribe();
    }
}