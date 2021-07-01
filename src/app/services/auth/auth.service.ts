import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../interfaces/user';
import * as moment from "moment";

interface AuthResponse {
	token: string;
	user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
	SERVER_URL: string = "http://localhost:4040";

	private user$ = new BehaviorSubject<User | null>(null);
	public isAuthenticated : boolean = false;

  	constructor(private httpClient: HttpClient) { }
	
	signin(username: string, password: string): Observable<AuthResponse>{
		return this.httpClient
					.post<AuthResponse>(`${this.SERVER_URL}/signin`, { username: username, password: password})
					.pipe(map(res => {
						let user = res['data'].user, 
						token = res['data'].idToken,
						expiresInDuration = res['data'].expiresIn;

						// save the token and expiration date to local storage
						const now = new Date();
						const expirationDate = new Date(now.getTime() + expiresInDuration*1000);
						this.saveAuthData(token, expirationDate);
						this.isAuthenticated = true;
						this.user$.next(user);

						return user;
					
					}));
	}

	signout(){
		this.clearAuthData();
		this.user$.next(null);
	}

	public get getUser(): User{
		return this.user$.value;
	}

	private saveAuthData(token: string, expirationDate: Date) : void{
		window.localStorage.setItem('token', token);
		window.localStorage.setItem('expiration', expirationDate.toISOString());
	}

	private clearAuthData() : void{
		// remove token and expiration in local storage
		window.localStorage.removeItem('token');
		window.localStorage.removeItem('expiration');
	}

	public get getAuthData(){
		const token = window.localStorage.getItem('token');
		const expirationDate = window.localStorage.getItem('expiration');

		if(!token && !expirationDate)
			return;
		return { token: token, expirationDate : new Date(expirationDate)};
	}
}
