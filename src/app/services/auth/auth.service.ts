import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../interfaces/user';
import { TokenStorage } from './token.storage';

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

  	constructor(private httpClient: HttpClient,
				private tokenStorage: TokenStorage) { }
	
	login(username: string, password: string): Observable<AuthResponse>{
		return this.httpClient
					.post<AuthResponse>(`${this.SERVER_URL}/signin`, { username: username, password: password})
					.pipe(map(res => {
						let user = res['data']['user'],
							token = res['data']['token'];
						
						this.tokenStorage.saveToken(token);
						this.user$.next(user);
						
						return user;
					}));
	}

	public get getUser(): User{
		return this.user$.value;
	}
}
