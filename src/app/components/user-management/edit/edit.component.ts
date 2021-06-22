import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'
import { UserManagementService } from '../../../services/user_management/user-management.service';

@Component({
	selector: 'app-edit-user',
	templateUrl: './edit.component.html',
})
export class EditUserComponent implements OnInit{
    userFormInfo: FormGroup;
    userId : string;
    createdTime : string;
    submitted = false;

    constructor(protected router: Router,
                private route : ActivatedRoute,
                private userService : UserManagementService){
        
        // get user ID from user management page
        this.route.queryParams.subscribe((params) => {
            this.userId = params['id'];
        });

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
            .subscribe((res) => {
                if(res['status'] == 1) // status = 1 => OK
                    this.router.navigate(['/user_management']);
            });
    }
}
