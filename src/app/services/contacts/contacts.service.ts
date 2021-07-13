import { Injectable } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, shareReplay } from 'rxjs/operators';
import { LoadingService } from '../loading/loading.service';
import { ToastMessageService } from '../toast_message/toast-message.service';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
	SERVER_URL: string = "http://localhost:4040/contacts";
	private contacts$ : BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);

	constructor(private httpClient: HttpClient,
				private formBuilder: FormBuilder,
				private loadingService: LoadingService,
                private toastMessage: ToastMessageService,
				private router: Router) { }
	
	initContact(){
		return this.formBuilder.group({
			contactName: new FormControl('', [Validators.required]),
            salutation: new FormControl([], [Validators.required]),
            mobilePhone: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
            email: new FormControl('', [Validators.email]),
            organization: new FormControl(''),
            dob: new FormControl(''),
            leadSrc: new FormControl([], [Validators.required]),
            assignedTo: new FormControl([], [Validators.required]),
            address: new FormControl(''),
            description: new FormControl(''),
		});
	}

	// add a contact
	addContact(contact: Contact) : Observable<void>{
		this.loadingService.showLoading();
		return this.httpClient
					.post<void>(this.SERVER_URL, contact).pipe(
						tap((res) => {
							// implement side effects
							this.loadingService.hideLoading();
							if(res['status'] == 1){
								// show successful message
                    			// display the snackbar belong with the indicator
								this.toastMessage.showInfo('Success to add a new contact!');
								this.router.navigateByUrl('/contacts'); // navigate back to the contacts page
							}
							else {
								// show error message
                    			this.toastMessage.showError('Failed to add a new contact!');
							}
						})
					);
	}
	
	// fetch list of contacts
	fetchContacts():Observable<Contact[]>{
		return this.httpClient
					.get<Contact[]>(this.SERVER_URL)
					.pipe(
						map(res => res['data'].contacts),
						tap((contacts) => {
							// save the list of contacts
							this.contacts$.next(contacts);
						}),
					);
	}

	// get list of contacts
	getContacts() : Observable<Contact[]>{
		return this.contacts$.asObservable().pipe(shareReplay());
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
		this.loadingService.showLoading();
		return this.httpClient
					.delete<void>(`${this.SERVER_URL}/${contactId}?_method=DELETE`)
					.pipe(
						tap((res) => {
							this.loadingService.hideLoading();
							if(res['status'] == 1){ // status = 1 => OK
                                // show successful message
                                // display the snackbar belong with the indicator
                                this.toastMessage.showInfo('Success to delete the contact!');
                            }
                            else {
                                // show error message
                                this.toastMessage.showError('Failed to delete the contact!');
                            }
						})
					);
	}

	// delete multi contacts by list of contact ID
	deleteContacts(contactIds : string[]):Observable<void>{
		return this.httpClient
					.post<void>(`${this.SERVER_URL}/delete`, contactIds);
	}
}
