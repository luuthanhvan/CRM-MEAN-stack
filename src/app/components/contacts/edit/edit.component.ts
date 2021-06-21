import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../../../services/contacts/contacts.service'; // use contacts service
import { UserManagementService } from '../../../services/user_management/user-management.service'; // use user service

@Component({
    selector: 'app-edit-contact',
    templateUrl: './edit.component.html',
})
export class EditContactsComponent implements OnInit {
    contactFormInfo: FormGroup;
    salutations : string[] =  ['None', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
    leadSources : string[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];
    contactId : string;
    createdTime: any;
    users : any;
    submitted = false;
    
    constructor(protected router: Router, 
                private route: ActivatedRoute,
                protected contactsService : ContactsService,
                private userService : UserManagementService){
        
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
        contactInfo.updatedTime = new Date(Date.now()).toLocaleString();
        
        this.contactsService
            .updateContact(this.contactId, contactInfo)
            .subscribe((res) => {
                if(res['status'] == 1){ // status = 1 => OK
                    this.router.navigate(['/contacts']); // go back to the contacts page
                }
            });
    }
}