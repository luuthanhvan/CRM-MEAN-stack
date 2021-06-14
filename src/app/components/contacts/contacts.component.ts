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
    SERVER_URL: string = "http://localhost:4040/contacts";
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
        this.httpClient
            .get(this.SERVER_URL)
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

    navigateToEdit(contactID: string) {
        let navigationExtras: NavigationExtras = {
            queryParams: { id: contactID },
        };
        this.router.navigate(["/contacts/edit"], navigationExtras);
    }

    onDelete(contactID: string) {
        this.httpClient
            .post(`${this.SERVER_URL}/delete`, { id: contactID })
            .subscribe(
                (res) => {
                    if(res['status'] == 1){
                        location.reload();
                    }
                }
            );
    }
}
