import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/user';
// import custom validator to validate that password and confirm password fields match
import { MustMatch } from '../../helpers/validation_functions';

@Injectable({
  	providedIn: 'root'
})
export class UserManagementService {
	SERVER_URL: string = "http://localhost:4040/user_management";

  	constructor(private formBuilder : FormBuilder,
				private httpClient : HttpClient) { }
	
	initUser(){
		return this.formBuilder.group({
			name: new FormControl('', [Validators.required]),
			username: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required, Validators.minLength(6)]),
			confirmPassword: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			phone: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
			isAdmin: new FormControl(false),
			isActive: new FormControl(false),
		},
		{
			validators: MustMatch('password', 'confirmPassword')	
		});
	}

	// add user
	addUser(userInfo : User):Observable<void>{
		return this.httpClient
					.post<void>(this.SERVER_URL, userInfo); 
	}

	// get list of users
	getUsers():Observable<User[]>{
		return this.httpClient
					.get<User[]>(this.SERVER_URL)
					.pipe(map(res => res['data']['users']));
	}

	// get a user by user ID
	getUser(userId: string):Observable<User>{
		return this.httpClient
					.get<User>(`${this.SERVER_URL}/${userId}`)
					.pipe(map(res => res['data']['user']));
	}

	// update a user by user ID
	updateUser(userId : string, userInfo: User):Observable<void>{
		return this.httpClient
					.put<void>(`${this.SERVER_URL}/${userId}`, userInfo);
	}
}
