import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ContactsService } from '../../../services/contacts/contacts.service';

@Component({
    selector: 'app-edit-contact',
    templateUrl: './edit.component.html',
})
export class EditContactsComponent implements OnInit {
    SERVER_URL : String = 'http://localhost:4040/contacts'; // typescript variable declaration
    contactFormInfo: FormGroup;
    contactId : string;
    createdTime: any;

    constructor(private httpClient : HttpClient, 
                private route: ActivatedRoute,
                protected contactsService : ContactsService){
        
        this.route.queryParams.subscribe((params) => {
            this.contactId = params['id'];
        });

        this.contactFormInfo = this.contactsService.prepareFormData();
    }

    ngOnInit(){
        this.httpClient
            .post(`${this.SERVER_URL}/edit`, { id: this.contactId })
            .pipe(map(res => res['data']['contact']))
            .subscribe(
                (res) => {
                    this.contactsService.setContactInfo(this.contactFormInfo, res);
                    this.createdTime = res.createdTime; // to keep the created time when update a contact
                }
        );
    }

    onSubmit(form: FormGroup){
        let body = {
            contactId: this.contactId,
            contactInfo: this.contactsService.prepareDataToSubmit(form, this.createdTime),
        }

        console.log(body);

        this.httpClient.post(`${this.SERVER_URL}/update`, body)
            .subscribe(
                (res) => {
                    if(res['status'] == 1){ // status = 1 => OK
                        this.contactsService.gotoPage('/contacts');
                    }
                }
            );
    }
}