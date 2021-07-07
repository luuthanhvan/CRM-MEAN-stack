import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactsService } from '../../../services/contacts/contacts.service'; // use contacts service
import { UserManagementService } from '../../../services/user_management/user-management.service'; // use user service
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';

@Component({
    selector: 'app-add-contact',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AddContactComponent implements OnInit{
    contactFormInfo: FormGroup; // typescript variable declaration
    salutations : string[] =  ['None', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
    leadSources : string[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];
    users : Object;
    submitted = false;

    // some variables for the overlay progress bar
    color = 'primary';
    mode = 'indeterminate';
    value = 50;
    displayProgressSpinner = false;
    spinnerWithoutBackdrop = false;

    // some variables for the the snackbar (a kind of toast message)
    sucessfulMessage: string = 'Success to add a new contact!';
    errorMessage: string = 'Failed to add a new contact!';
    label: string = '';
    setAutoHide: boolean = true;
    autoHide: number = 1500;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    constructor(protected contactsService : ContactsService,
                private userService : UserManagementService,
                protected router : Router,
                public snackBar: MatSnackBar){
    }

    ngOnInit(){
        this.contactFormInfo = this.contactsService.initContact();
        // get list of users from database and display them to the Assigned field in the contactFormInfo
        this.userService
            .getUsers()
            .subscribe((data) => {
                this.users = data.map((value) => {
                    return {userId: value._id,
                            name: value.name};
                });      
            });
    }

    get contactFormControl(){
        return this.contactFormInfo.controls;
    }

    // function to handle upload contact information to server
    onSubmit(form: FormGroup){
        this.submitted = true;
        let contactInfo = form.value;
        contactInfo.createdTime = new Date();
        contactInfo.updatedTime = new Date();

        let config = new MatSnackBarConfig();
        config.verticalPosition = this.verticalPosition;
        config.horizontalPosition = this.horizontalPosition;
        config.duration = this.setAutoHide ? this.autoHide : 0;

        // overlay progress spinner when call api
        this.displayProgressSpinner = true;
        setTimeout(() => {
            this.displayProgressSpinner = false;
            this.contactsService.addContact(contactInfo).subscribe(
                (res) => {
                    if(res['status'] == 1){ // status = 1 => OK
                        // show successful message
                        // display the snackbar belong with the indicator
                        config.panelClass = ['success'];
                        this.snackBar.open(this.sucessfulMessage, this.label, config);
                        this.router.navigateByUrl('/contacts'); // navigate back to the contacts page
                    }
                },
                (err) => {
                    // show error message
                    config.panelClass = ['failed'];
                    this.snackBar.open(this.errorMessage, this.label, config);
                }
            );
        }, 3000);
    }
}