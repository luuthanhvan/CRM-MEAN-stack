import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { UserManagementService } from '../../services/user_management/user-management.service';
import { DatetimeService } from '../../services/datetime/datetime.service';

@Component({
	selector: 'app-user-management',
	templateUrl: './user-management.component.html',
	styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
	displayedColumns: string[] = [
		"name",
		"username",
		"email",
		"isAdmin",
		"isActive",
		"createdTime",
		"modify",
	];
	dataSource : User[] = [];
	users$ : Observable<User[]>;

	constructor(private router: Router,
				private userService: UserManagementService,
				public dialog: MatDialog,
				protected datetimeService: DatetimeService) {
	}

	ngOnInit() {
		this.users$ = this.userService.getUsers();
	}

	// navigate to the edit sale order page
	navigateToEdit(userId: string) {
		let navigationExtras: NavigationExtras = {
			queryParams: { id: userId },
		};
		this.router.navigate(["/user_management/edit"], navigationExtras);
	}
}
