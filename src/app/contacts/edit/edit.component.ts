import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-edit-contact',
    templateUrl: './edit.component.html',
})
export class EditContactsComponent implements OnInit {
    contactFormInfo: FormGroup; // typescript variable declaration
    salutations : String[] =  ['None', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
    leadSources : String[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];
    assignedToUsers : String[] = ['User1', 'User2', 'User3'];
    
    SERVER_URL : String = 'http://localhost:4040/contacts';
    contactId : string;
    contactInfo: any;
    createdTime: any;

    constructor(private router: Router, private formBuilder: FormBuilder,
        private httpClient : HttpClient, private route: ActivatedRoute){
        
        this.route.queryParams.subscribe((params) => {
            this.contactId = params['id'];
        });

        this.contactFormInfo = this.formBuilder.group({
            contactName: new FormControl(''),
            salutation: new FormControl(this.salutations),
            mobilePhone: new FormControl(''),
            email: new FormControl(''),
            organization: new FormControl(''),
            dob: new FormControl(''),
            leadSrc: new FormControl(this.leadSources),
            assignedTo: new FormControl(this.assignedToUsers),
            address: new FormControl(''),
            description: new FormControl(''),
        });
    }

    ngOnInit(){
        this.httpClient.post(this.SERVER_URL+'/edit', { id: this.contactId }).subscribe(
            (res) => {
                this.contactFormInfo.setValue({
                    contactName: res['data']['contact'].contactName,
                    salutation: res['data']['contact'].salutation,
                    mobilePhone: res['data']['contact'].mobilePhone,
                    email: res['data']['contact'].email,
                    organization: res['data']['contact'].organization,
                    dob: res['data']['contact'].dob,
                    leadSrc: res['data']['contact'].leadSrc,
                    assignedTo: res['data']['contact'].assignedTo,
                    address: res['data']['contact'].address,
                    description: res['data']['contact'].description,
                });
                this.createdTime = res['data']['contact'].createdTime; // keep created time
            }
        );
    }

    onSubmit(form: FormGroup){
        const url : string = this.SERVER_URL + '/update';
        let date = new Date(form.value.dob).toLocaleString();
        let dob = date.substring(0, date.indexOf(','));

        const body : any = {
            contactId: this.contactId,
            contactInfo: {
                contactName: form.value.contactName,
                salutation: form.value.salutation,
                mobilePhone: form.value.mobilePhone,
                email: form.value.email,
                organization: form.value.organization,
                dob: dob,
                leadSrc: form.value.leadSrc,
                assignedTo: form.value.assignedTo,
                address: form.value.address,
                description: form.value.description,
                createdTime: this.createdTime,
                updatedTime: Date.now(),
            },
        }

        this.httpClient.post<any>(url, body).subscribe();
        this.goBack();
    }

    goBack(){
        this.router.navigate(['/contacts']);
    }
}