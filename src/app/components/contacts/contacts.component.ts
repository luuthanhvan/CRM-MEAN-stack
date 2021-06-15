import { Component, OnInit } from "@angular/core";
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";
import { Router, NavigationExtras } from "@angular/router";

import { Contact } from '../../interfaces/contact'; // import contact interface
import { ContactsService } from '../../services/contacts/contacts.service'; // inport contacts service

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

    constructor(private router: Router, 
                protected contactsService: ContactsService,
                private formBuilder: FormBuilder) {}

    ngOnInit() {
        // get list of contacts
        this.contactsService.getContacts().subscribe((data) => {
            this.dataSource = data.map((value, index) => {
                value.no = index+1;
                return value;
            });
        });

        this.filtersForm = this.formBuilder.group({
            leadSrc: new FormControl(this.contactsService.leadSources),
            createdTime: new FormControl(''),
            updatedTime: new FormControl(''),
        });
    }

    // function to cancel filters
    onCancel(){
        location.reload();
    }

    // navigate to edit page
    navigateToEdit(contactId: string) {
        let navigationExtras: NavigationExtras = {
            queryParams: { id: contactId },
        };
        this.router.navigate(["/contacts/edit"], navigationExtras);
    }

    // function to handle delete event
    onDelete(contactId: string) {
        this.contactsService
            .deleteContact(contactId)
            .subscribe((res) => {
                if(res['status'] == 1){
                    location.reload();
                }
            });
    }
}
