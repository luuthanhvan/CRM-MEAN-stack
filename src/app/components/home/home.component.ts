import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MustMatch } from '../../helpers/validation_functions';
import { UserManagementService } from '../../services/user_management/user-management.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading/loading.service';
import { ToastMessageService } from '../../services/toast_message/toast-message.service';
import { languageList } from '../../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
	currentUser : User;
	isBrowserRefresh : boolean;
	isAdminUser : boolean = false;
	
	languageList = languageList;
	
	constructor(public authService : AuthService,
				public dialog: MatDialog,
				public router : Router){
	}
	
	ngOnInit(){
		// get user logged in info
		const isLoggedIn = this.authService.isLoggedIn();

		if(isLoggedIn){
			// because Home component is rendered before Dashboard component, we call me API first here and use getUser() in Dashboard later
			this.authService.me().subscribe((data) => {
				this.currentUser = data;
				this.isAdminUser = this.currentUser.isAdmin;
			});
		}
	}

	signout(){
		this.authService.removeToken();
		this.router.navigateByUrl('/signin');
	}

	openDialog(){
		let dialogRef = this.dialog.open(HomeChangePasswordComponent);
		dialogRef.afterClosed().subscribe();
    }
}

@Component({
    selector: 'home-change-password',
    templateUrl: './home-change-password.component.html'
})
export class HomeChangePasswordComponent{
	changePassForm : FormGroup;
	submitted : boolean = false;
	currentUser : User;
    successMessage: string = 'Success to change the password!';
    errorMessage: string = 'Failed to change the password!';

    constructor(private formBuilder : FormBuilder,
				private userService : UserManagementService,
				private authService : AuthService,
                private loadingService: LoadingService,
				private toastMessage: ToastMessageService){

		this.changePassForm = this.formBuilder.group({
			oldPass: new FormControl('', [Validators.required, Validators.minLength(6)]), 
			newPass: new FormControl('', [Validators.required, Validators.minLength(6)]),
			confirmPass: new FormControl('', [Validators.required]),
		},
		{
			validators: MustMatch('newPass', 'confirmPass')	
		});

		// get user logged in info
		const isLoggedIn = this.authService.isLoggedIn();
		if(isLoggedIn){
			this.authService.me().subscribe(data => {
				this.currentUser = data;
			})
		}
	}

	get changePassFormControl(){
		return this.changePassForm.controls;
	}

	onSubmit(form : FormGroup){
		this.submitted = true;
		
		this.loadingService.showLoading();
		this.userService
				.changePassword(this.currentUser._id, form.value.newPass)
				.subscribe((res) => {
					if(res['status'] == 1){
						this.loadingService.hideLoading();
						// show successful message
						// display the snackbar belong with the indicator
						this.toastMessage.showInfo(this.successMessage);
					}
					else {
						// show error message
						this.toastMessage.showError(this.errorMessage);
					}
				});
	}
}