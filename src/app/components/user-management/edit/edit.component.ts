import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { UserManagementService } from '../../../services/user_management/user-management.service';
import { LoadingService } from '../../../services/loading/loading.service';
import { snackbarConfig } from '../../../helpers/snackbar_config';

@Component({
	selector: 'app-edit-user',
	templateUrl: './edit.component.html',
})
export class EditUserComponent implements OnInit{
    userFormInfo: FormGroup;
    userId : string;
    createdTime : string;
    submitted = false;

    // some variables for the the snackbar (a kind of toast message)
    successMessage : string = 'Success to save the user!';
    errorMessage : string = 'Failed to save the user!'
    label: string = '';
    setAutoHide: boolean = true;
    duration: number = 1500;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    constructor(protected router: Router,
                private route : ActivatedRoute,
                private userService : UserManagementService,
                public snackBar: MatSnackBar,
                private loadingService: LoadingService){
        
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
        
        this.loadingService.showLoading();
        this.userService
            .updateUser(this.userId, userInfo)
            .subscribe((res) => {
                this.loadingService.hideLoading();
                if(res['status'] == 1){ // status = 1 => OK
                    // show successful message
                    // display the snackbar belong with the indicator
                    let config = snackbarConfig(this.verticalPosition, this.horizontalPosition, this.setAutoHide, this.duration, ['success']);
                    this.snackBar.open(this.successMessage, this.label, config);
                    this.router.navigate(['/user_management']);
                }
                else {
                    // show error message
                    let config = snackbarConfig(this.verticalPosition, this.horizontalPosition, this.setAutoHide, this.duration, ['failed']);
                    this.snackBar.open(this.errorMessage, this.label, config);
                }
            });
    }
}
