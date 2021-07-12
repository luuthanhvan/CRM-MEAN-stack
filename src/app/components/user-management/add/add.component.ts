import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router'
import { UserManagementService } from '../../../services/user_management/user-management.service';
import { LoadingService } from '../../../services/loading/loading.service';
import { ToastMessageService } from '../../../services/toast_message/toast-message.service';

@Component({
    selector: 'app-add-user',
    templateUrl: './add.component.html',
})
export class AddUserComponent implements OnInit{
    userFormInfo: FormGroup; // typescript variable declaration
    submitted = false;
    successMessage: string = 'Success to add a new user!';
    errorMessage: string = 'Failed to add a new user!';

    constructor(protected router: Router,
                private userService : UserManagementService,
                private loadingService: LoadingService,
                private toastMessage: ToastMessageService){}

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
                    this.toastMessage.showInfo(this.successMessage);
                    this.router.navigate(['/user_management']);
                }
                else {
                    // show error message
                    this.toastMessage.showError(this.errorMessage);
                }
            });
    }
}