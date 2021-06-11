import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-add-contact',
    templateUrl: './add.component.html',
})
export class AddContactComponent implements OnInit{
    
    contactFormInfo: FormGroup; // typescript variable declaration
    salutations : String[] =  ['None', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
    leadSources : String[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];
    assignedToUsers : String[] = ['User1', 'User2', 'User3'];
    
    SERVER_URL : String = 'http://localhost:4040/contacts';

    constructor(private router: Router, private formBuilder: FormBuilder, private httpClient : HttpClient){

    }

    ngOnInit(){
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

    onSubmit(form: FormGroup){
        // console.log(form.value);
        const url : string = this.SERVER_URL + '/store';
        let date = new Date(form.value.dob).toLocaleString();
        let dob = date.substring(0, date.indexOf(','));

        const body : any = {
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
        }

        this.httpClient.post<any>(url, body).subscribe();
        this.goBack();
    }

    goBack(){
        this.router.navigate(['/contacts']);
    }
}