import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { ContactsService } from '../../../services/contacts/contacts.service'; // use contacts service
import { UserManagementService } from '../../../services/user_management/user-management.service'; // use user service
import { LoadingService } from '../../../services/loading/loading.service';
import { snackbarConfig } from '../../../helpers/snackbar_config';

@Component({
    selector: 'app-edit-contact',
    templateUrl: './edit.component.html',
})
export class EditContactsComponent implements OnInit {
    contactFormInfo: FormGroup;
    salutations : string[] =  ['None', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
    leadSources : string[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];
    contactId : string;
    createdTime: string;
    users : Object;
    submitted = false;

    // some variables for the the snackbar (a kind of toast message)
    successMessage : string = 'Success to save the contact!';
    errorMessage : string = 'Failed to save the contact!'
    label: string = '';
    setAutoHide: boolean = true;
    duration: number = 1500;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    
    constructor(protected router: Router, 
                private route: ActivatedRoute,
                protected contactsService : ContactsService,
                private userService : UserManagementService,
                public snackBar: MatSnackBar,
                private loadingService: LoadingService){
        
        // get contact ID from contact page
        this.route.queryParams.subscribe((params) => {
            this.contactId = params['id'];
        });

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

    ngOnInit(){
        // load contact information to the contact form
        this.contactsService
            .getContact(this.contactId)
            .subscribe((data) => {
                this.contactFormInfo.setValue({
                    contactName: data.contactName,
                    salutation: data.salutation,
                    mobilePhone: data.mobilePhone,
                    email: data.email,
                    organization: data.organization,
                    dob: data.dob,
                    leadSrc: data.leadSrc,
                    assignedTo: data.assignedTo,
                    address: data.address,
                    description: data.description,
                });
                this.createdTime = data.createdTime; // to keep the created time when update a contact information
            });
    }

    get contactFormControl(){
        return this.contactFormInfo.controls;
    }

    // function to handle update a contact
    onUpdate(form: FormGroup){
        this.submitted = true;
        let contactInfo = form.value;
        contactInfo.createdTime = this.createdTime;
        contactInfo.updatedTime = new Date();
        
        this.loadingService.showLoading();
        this.contactsService
            .updateContact(this.contactId, contactInfo)
            .subscribe((res) => {
                this.loadingService.hideLoading();
                if(res['status'] == 1){
                    // show successful message
                    // display the snackbar belong with the indicator
                    let config = snackbarConfig(this.verticalPosition, this.horizontalPosition, this.setAutoHide, this.duration, ['success']);
                    this.snackBar.open(this.successMessage, this.label, config);
                    this.router.navigateByUrl('/contacts');
                }
                else {
                    // show error message
                    let config = snackbarConfig(this.verticalPosition, this.horizontalPosition, this.setAutoHide, this.duration, ['failed']);
                    this.snackBar.open(this.errorMessage, this.label, config);
                }
            });
    }
}