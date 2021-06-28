import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	signinForm : FormGroup;

	constructor(private formBuilder : FormBuilder,
				private authService : AuthService,
				private router : Router) { }

	ngOnInit() {
		this.signinForm = this.formBuilder.group({
			username: new FormControl(),
			password: new FormControl()
		});
	}

	onSubmit(form: FormGroup){
		let userInfo = form.value;
		// console.log(userInfo);

		this.authService
			.login(userInfo.username, userInfo.password)
			.subscribe((data) => { 
				// console.log(data); 
				this.router.navigate(['/dashboard'])
			});
	}
}
