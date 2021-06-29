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

  	constructor(private httpClient: HttpClient) { }
	
	signin(username: string, password: string): Observable<AuthResponse>{
		return this.httpClient
					.post<AuthResponse>(`${this.SERVER_URL}/signin`, { username: username, password: password})
					.pipe(map(res => {
						let user = res['data'].user, 
							token = res['data'].idToken,
							expiresIn = res['data'].expiresIn;

						const expiresAt = moment().add(expiresIn, 'hour');
						// local storage token
						window.localStorage.setItem('id_token', token.id);
						window.localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));

						this.user$.next(user);
						return user;
					}));
	}

	signout(){
		window.localStorage.removeItem('id_token');
		window.localStorage.removeItem('expires_at');
		this.user$.next(null);
	}

	public get getUser(): User{
		return this.user$.value;
	}

	public isLoggedIn(){
		return moment().isBefore(this.getExpiration());
	}

	isLoggedOut(){
		return !this.isLoggedIn();
	}

	getExpiration(){
		const expiration = window.localStorage.getItem('expires_at');
		const expiresAt = JSON.parse(expiration);

		return moment(expiresAt);
	}
}
