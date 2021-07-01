import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MustMatch } from '../../helpers/validation_functions';
import { UserManagementService } from '../../services/user_management/user-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
	currentUser : User;
	isBrowserRefresh : boolean;
	isAdminUser : boolean = false;

	constructor(private authService : AuthService,
				public dialog: MatDialog,
				private router : Router){}
	
	ngOnInit(){
		this.currentUser = this.authService.getUser;
		this.isAdminUser = this.currentUser.isAdmin;
	}

	signout(){
		this.authService.signout();
		window.location.reload();
	}

	openDialog(){
		let dialogRef = this.dialog.open(HomeChangePasswordComponent);
		dialogRef.afterClosed().subscribe(result => {
			// console.log(result);
			if(result){ // if the password successfully changed, then sign-out
				window.location.reload();
				this.signout();
			}
		});
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

    constructor(private formBuilder : FormBuilder,
				private userService : UserManagementService,
				private authService : AuthService,
				private router : Router){
		this.changePassForm = this.formBuilder.group({
			oldPass: new FormControl('', [Validators.required, Validators.minLength(6)]), 
			newPass: new FormControl('', [Validators.required, Validators.minLength(6)]),
			confirmPass: new FormControl('', [Validators.required]),
		},
		{
			validators: MustMatch('newPass', 'confirmPass')	
		});
	}

	get changePassFormControl(){
		return this.changePassForm.controls;
	}

	onSubmit(form : FormGroup){
		this.submitted = true;

		// get current user
		this.currentUser = this.authService.getUser;

		this.userService
				.changePassword(this.currentUser._id, form.value.newPass)
				.subscribe();
	}
}