import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router'
import { UserManagementService } from '../../../services/user_management/user-management.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { snackbarConfig } from '../../../helpers/snackbar_config';
import { LoadingService } from '../../../services/loading/loading.service';

@Component({
    selector: 'app-add-user',
    templateUrl: './add.component.html',
})
export class AddUserComponent implements OnInit{
    
    userFormInfo: FormGroup; // typescript variable declaration
    submitted = false;

    // some variables for the the snackbar (a kind of toast message)
    sucessfulMessage: string = 'Success to add a new user!';
    errorMessage: string = 'Failed to add a new user!';
    label: string = '';
    setAutoHide: boolean = true;
    duration: number = 1500;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    constructor(protected router: Router,
                private userService : UserManagementService,
                public snackBar: MatSnackBar,
                private loadingService: LoadingService){}

    ngOnInit(){
        this.userFormInfo = this.userService.initUser();
    }

    get contactFormControl(){
        return this.userFormInfo.controls;
    }

    onSubmit(form: FormGroup){
        this.submitted = true;
        let userInfo = form.value;
        userInfo.createdTime = new Date();
        
        this.loadingService.showLoading();
        this.userService
            .addUser(userInfo)
            .subscribe((res) => {
                this.loadingService.hideLoading();
                if(res['status'] == 1){ // status = 1 => OK
                    // show successful message
                    // display the snackbar belong with the indicator
                    let config = snackbarConfig(this.verticalPosition, this.horizontalPosition, this.setAutoHide, this.duration, ['success']);
                    this.snackBar.open(this.sucessfulMessage, this.label, config);
                    this.router.navigate(['/user_management']);
                }
                else {
                    // show error message
                    // config.panelClass = ['failed'];
                    let config = snackbarConfig(this.verticalPosition, this.horizontalPosition, this.setAutoHide, this.duration, ['failed']);
                    this.snackBar.open(this.errorMessage, this.label, config);
                }
            });
    }
}