import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";
import { Router, NavigationExtras } from "@angular/router";
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Contact } from '../../interfaces/contact';
import { ContactsService } from '../../services/contacts/contacts.service';

@Component({
    selector: "app-contacts",
    templateUrl: "./contacts.component.html",
    styleUrls: ["./contacts.component.scss"],
})
export class ContactsComponent implements OnInit {
    displayedColumns: string[] = [
        "no",
        "contactName",
        "salutation",
        "mobilePhone",
        "email",
        "organization",
        "dob",
        "leadSrc",
        "assignedTo",
        "creator",
        "address",
        "description",
        "createdTime",
        "updatedTime",
        "modify",
        "delete",
    ];
    dataSource: Contact[] = [];
    filtersForm : FormGroup;

    constructor(private httpClient: HttpClient, 
                private router: Router, 
                protected contactsService: ContactsService,
                private formBuilder: FormBuilder) {
        
        // get list of contacts
        this.httpClient
            .get(this.contactsService.SERVER_URL)
            .pipe(map(res => res['data']['contacts']))
            .subscribe(res => {
                this.dataSource = this.contactsService.getAllContactsInfo(res);
            });
    }

    ngOnInit() {
        this.filtersForm = this.formBuilder.group({
            leadSrc: new FormControl(this.contactsService.leadSources),
            createdTime: new FormControl(''),
            updatedTime: new FormControl(''),
        });
    }

    onSubmitFiltersForm(form: FormGroup){
        this.dataSource = this.contactsService.filterByLeadSrc(this.dataSource, form.value.leadSrc);
    }

    onCancel(){
        location.reload();
    }

    // navigate to edit page
    navigateToEdit(contactID: string) {
        let navigationExtras: NavigationExtras = {
            queryParams: { id: contactID },
        };
        this.router.navigate(["/contacts/edit"], navigationExtras);
    }

    // function to handle delete event
    onDelete(contactID: string) {
        this.httpClient
            .delete(`${this.contactsService.SERVER_URL}/${contactID}?_method=DELETE`)
            .subscribe(
                (res) => {
                    if(res['status'] == 1){
                        location.reload();
                    }
                }
            );
    }
}
