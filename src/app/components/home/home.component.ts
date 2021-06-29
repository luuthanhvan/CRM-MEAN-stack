import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	currentUser : User;
	
	constructor(private authService : AuthService) { 
		// get current user information
		this.currentUser = this.authService.getUser;
	}

	ngOnInit() {
	}

	signout(){
		this.authService.signout();
		window.location.reload();
	}
}
