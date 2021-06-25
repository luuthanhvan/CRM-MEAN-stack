import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
	SERVER_URL: string = "http://localhost:4040";
	
  	constructor(private httpClient: HttpClient) { }

	userAuth(username: string, password: string): Observable<string>{
		return this.httpClient
					.post<string>(`${this.SERVER_URL}/signin`, { username: username, password: password})
					.pipe(map(res => res['data']['userId']));
	}
}
