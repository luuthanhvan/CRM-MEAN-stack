import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../interfaces/user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
	SERVER_URL: string = "http://localhost:4040";
	noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

	private user$ = new BehaviorSubject<User | null>(null);

  	constructor(private httpClient: HttpClient) { }
	
	signin(username: string, password: string) : Observable<void>{
		return this.httpClient
					.post<void>(`${this.SERVER_URL}/signin`, { username, password }, this.noAuthHeader);					
	}

	me() : Observable<User>{
		return this.httpClient
					.get<User>(`${this.SERVER_URL}/userProfile`)
					.pipe(map(res => res['data'].user));
	}

	// helper functions
	setToken(token: string) : void{
		window.localStorage.setItem('token', token);
	}

	removeToken() : void{
		// remove token in local storage
		window.localStorage.removeItem('token');
	}

	getToken(){
		const token = window.localStorage.getItem('token');

		if(!token)
			return;
		return token;
	}

	getUserPayload() {
		var token = this.getToken();
		if (token) {
			var userPayload = atob(token.split('.')[1]);
			return JSON.parse(userPayload);
		}
		else
		  	return null;
	  }
	
	  isLoggedIn() {
		var userPayload = this.getUserPayload();
		if (userPayload)
		  	return userPayload.exp > Date.now() / 1000;
		else
		  	return false;
	  }
}
