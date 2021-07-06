import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../interfaces/user';
import { UserManagementService } from '../../services/user_management/user-management.service';
import { datetimeFormat } from '../../helpers/datetime_format';
import { EditUserDialog } from './edit-dialog/user-edit-dialog.component';

@Component({
	selector: 'app-user-management',
	templateUrl: './user-management.component.html',
	styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
	displayedColumns: string[] = [
		"no",
		"name",
		"username",
		"email",
		"isAdmin",
		"isActive",
		"createdTime",
		// "modify",
	];
	dataSource : User[] = [];

	constructor(private router: Router,
				private userService: UserManagementService,
				public dialog: MatDialog,) {
		
		// get list of users
		this.userService.getUsers().subscribe((data) => {
			this.dataSource = data.map((value, index) => {
				value.no = index+1;
				value.createdTime = datetimeFormat(value.createdTime);
				return value;
			});
		});
	}

	ngOnInit() {

	}

	// navigate to the edit sale order page
	navigateToEdit(userId: string) {
		let navigationExtras: NavigationExtras = {
			queryParams: { id: userId },
		};
		this.router.navigate(["/user_management/edit"], navigationExtras);
	}

	onClickedRow(row : User){
        let dialogRef = this.dialog.open(EditUserDialog, { disableClose : false, panelClass: 'formDialog' });
        dialogRef.componentInstance.userId = row._id;
        dialogRef.afterClosed().subscribe(
            (result) => {
                if(result){
                    window.location.reload();
                }
                else {
                    dialogRef = null;
                }
            }
        );
    }
}
