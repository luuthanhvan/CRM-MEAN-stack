import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	signinForm : FormGroup;
	submitted : boolean = false;
	isLoggingFailed : boolean = false;
	errorMessage : string;

	constructor(private formBuilder : FormBuilder,
				private authService : AuthService,
				private router : Router) {
	}

	ngOnInit() {
		this.signinForm = this.formBuilder.group({
			username: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required, Validators.minLength(6)])
		});

		const isLoggedIn = this.authService.isLoggedIn();

		if(isLoggedIn){
			this.router.navigateByUrl('/dashboard');
		}
	}

	get signinFormControl(){
		return this.signinForm.controls;
	}

	onSubmit(form: FormGroup){
		this.submitted = true;
		let userInfo = form.value;

		this.authService
			.signin(userInfo.username, userInfo.password)
			.subscribe(res => {
				this.authService.setToken(res['data'].token);
				this.router.navigateByUrl('/dashboard');
			});
	}
}
