import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MustMatch } from '../../helpers/validation_functions';
import { UserManagementService } from '../../services/user_management/user-management.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
				private router : Router){
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
			// this.authService.getUser().subscribe(user => {
			// 	this.currentUser = user; // this line will get information of an user
			// 	console.log(this.currentUser); // result like: eg: {_id: "60d14ee04da4be2d06331514", name: "thanh van", username: "lthanhvan", email: "van@gmail.com", phone: "1234566788", …}
			// 	this.isAdminUser = this.currentUser.isAdmin; // TypeError: Cannot read property 'isAdmin' of null
			// })
		}
		
	}

	signout(){
		this.authService.removeToken();
		this.router.navigateByUrl('/signin');
	}

	openDialog(){
		let dialogRef = this.dialog.open(HomeChangePasswordComponent);
		dialogRef.afterClosed().subscribe((result) => {
			if(result){ // if password successfully changed, then sign-out
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
		
		this.userService
				.changePassword(this.currentUser._id, form.value.newPass)
				.subscribe();
	}
}