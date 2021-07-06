import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ContactsService } from '../../../services/contacts/contacts.service'; // use contacts service
import { UserManagementService } from '../../../services/user_management/user-management.service'; // use user service
import { ContactConfirmationDialog } from '../delete-dialog/confirmation-dialog.component';

@Component({
    selector: 'edit-contact-dialog',
    templateUrl: 'contacts-edit-dialog.component.html'
})
export class EditContactDialog implements OnInit{
    contactFormInfo: FormGroup;
    salutations : string[] =  ['None', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
    leadSources : string[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];
    contactId : string;
    createdTime: string;
    users : Object;
    submitted = false;

    constructor(protected router: Router,
                protected contactsService : ContactsService,
                private userService : UserManagementService,
                public dialog: MatDialog,){
        
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

    onDelete(){
        // show confirmation dialog before detele an item
        let dialogRef = this.dialog.open(ContactConfirmationDialog, { disableClose : false });
        dialogRef.componentInstance.confirmMess = `You want to delete the "${this.contactFormInfo.value.contactName}" contact?`;
        dialogRef.afterClosed().subscribe(
            (result) => {
                if(result){
                    // do confirmation action: delete the contact
                    this.contactsService
                        .deleteContact(this.contactId)
                        .subscribe(
                            (res) => {
                                if(res['status'] == 1){ // status = 1 => OK
                                    location.reload(); // reload contacts page
                                }
                            }
                        );
                }
                else{
                    dialogRef = null;
                }
            }
        )
    }

    // function to handle update a contact
    onUpdate(form: FormGroup){
        this.submitted = true;
        let contactInfo = form.value;
        contactInfo.createdTime = this.createdTime;
        contactInfo.updatedTime = new Date();
        
        this.contactsService
            .updateContact(this.contactId, contactInfo)
            .subscribe();
    }
}