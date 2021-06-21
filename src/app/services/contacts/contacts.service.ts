import { Injectable } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
	salutations : string[] =  ['None', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
    leadSources : string[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];

	SERVER_URL: string = "http://localhost:4040/contacts";

	constructor(private httpClient: HttpClient,
				private formBuilder: FormBuilder) { }
	
	initContact(){
		return this.formBuilder.group({
			contactName: new FormControl(''),
            salutation: new FormControl(this.salutations),
            mobilePhone: new FormControl(''),
            email: new FormControl(''),
            organization: new FormControl(''),
            dob: new FormControl(''),
            leadSrc: new FormControl(this.leadSources),
            assignedTo: new FormControl([]),
            address: new FormControl(''),
            description: new FormControl(''),
		});
	}

	// add a contact
	addContact(contact: Contact):Observable<void>{
		return this.httpClient
					.post<void>(this.SERVER_URL, contact);
	}
	
	// get list of contacts
	getContacts():Observable<Contact[]>{
		return this.httpClient
					.get<Contact[]>(this.SERVER_URL)
					.pipe(map(res => res['data']['contacts']));
	}

	// get a contact by contact ID
	getContact(contactId : string):Observable<Contact>{
		return this.httpClient
					.get<Contact>(`${this.SERVER_URL}/${contactId}`)
					.pipe(map(res => res['data']['contact']));
	}

	// update a contact by contact ID
	updateContact(contactId: string, contact: Contact):Observable<void>{
		return this.httpClient
					.put<void>(`${this.SERVER_URL}/${contactId}?_method=PUT`, contact);
	}

	// delete a contact by contact ID
	deleteContact(contactId : string):Observable<void>{
		return this.httpClient
					.delete<void>(`${this.SERVER_URL}/${contactId}?_method=DELETE`);
	}
}
