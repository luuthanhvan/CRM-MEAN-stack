import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	signinForm : FormGroup;

	constructor(private formBuilder : FormBuilder,
				private authService : AuthService) { }

	ngOnInit() {
		this.signinForm = this.formBuilder.group({
			username: new FormControl(),
			password: new FormControl()
		});
	}

	onSubmit(form: FormGroup){
		let userInfo = form.value;

		this.authService
			.userAuth(userInfo.username, userInfo.password)
			.subscribe((userId) =>{
				if(userId == ''){
					console.log("Failed authenication!!");
				}
				else {
					console.log(userId);
				}
			});
	}
}
