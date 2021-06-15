import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../../../services/contacts/contacts.service';

@Component({
    selector: 'app-edit-contact',
    templateUrl: './edit.component.html',
})
export class EditContactsComponent implements OnInit {
    contactFormInfo: FormGroup;
    contactId : string;
    createdTime: any;

    constructor(protected router: Router, 
                private route: ActivatedRoute,
                protected contactsService : ContactsService){
        
        // get contact id from contact page
        this.route.queryParams.subscribe((params) => {
            this.contactId = params['id'];
        });

        this.contactFormInfo = this.contactsService.initContact();
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

    // function to handle update a contact information
    onUpdate(form: FormGroup){
        let contactInfo = form.value;
        contactInfo.createdTime = this.createdTime;
        contactInfo.updatedTime = new Date(Date.now()).toLocaleString();
        
        this.contactsService
            .updateContact(this.contactId, contactInfo)
            .subscribe((res) => {
                if(res['status'] == 1){ // status = 1 => OK
                    this.router.navigate(['/contacts']);
                }
            });
    }
}