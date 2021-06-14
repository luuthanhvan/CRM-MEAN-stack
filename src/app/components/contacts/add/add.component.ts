import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContactsService } from '../../../services/contacts/contacts.service';

@Component({
    selector: 'app-add-contact',
    templateUrl: './add.component.html',
})
export class AddContactComponent implements OnInit{
    contactFormInfo: FormGroup; // typescript variable declaration
    SERVER_URL : String = 'http://localhost:4040/contacts';

    constructor(private httpClient : HttpClient,
                protected contactsService: ContactsService){}

    ngOnInit(){
        this.contactFormInfo = this.contactsService.prepareFormData();
    }

    onSubmit(form: FormGroup){
        this.httpClient.post<any>(`${this.SERVER_URL}/store`, this.contactsService.prepareDataToSubmit(form))
            .subscribe(
                (res) => {
                    if(res['status'] == 1){ // status = 1 => OK
                        this.contactsService.gotoPage('/contacts')
                    }
                }
            );
    }
}