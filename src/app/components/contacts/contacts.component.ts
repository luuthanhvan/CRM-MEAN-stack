import { Component, OnInit } from "@angular/core";
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";
import { Router, NavigationExtras } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { Contact } from '../../interfaces/contact'; // use contact interface
import { ContactsService } from '../../services/contacts/contacts.service'; // use contacts service
import { datetimeFormat } from '../../helpers/datetime_format';

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

    leadSources : string[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];
    leadSource : FormGroup;
    
    constructor(private router: Router, 
                protected contactsService: ContactsService,
                public dialog: MatDialog,
                private formBuilder: FormBuilder) {}

    ngOnInit() {
        // get list of contacts
        this.contactsService.getContacts().subscribe((data) => {
            this.dataSource = data.map((value, index) => {
                value.no = index+1;
                value.createdTime = datetimeFormat(value.createdTime);
                value.updatedTime = datetimeFormat(value.updatedTime);
                return value;
            });
        });

        this.leadSource = this.formBuilder.group({
            leadSrc: new FormControl(''),
        });
    }

    // function to cancel filter contacts
    onCancel(){
        location.reload();
    }

    // navigate to edit contact page
    navigateToEdit(contactId: string) {
        let navigationExtras: NavigationExtras = {
            queryParams: { id: contactId },
        };
        this.router.navigate(["/contacts/edit"], navigationExtras);
    }

    // function to handle delete a contact
    onDelete(contactId: string) {
        this.contactsService
            .deleteContact(contactId)
            .subscribe((res) => {
                if(res['status'] == 1){ // status = 1 => OK
                    location.reload(); // reload contacts page
                }
            });
    }

    openDialog(dialogName : string){
        if(dialogName === 'createdTime'){
            let dialogRef = this.dialog.open(ContactsCreatedTimeDialogComponent);
            dialogRef.afterClosed().subscribe(result => {
                // console.log(`Dialog result: ${result}`);
            });
        }

        else if(dialogName === 'updatedTime'){
            let dialogRef = this.dialog.open(ContactsUpdatedTimeDialogComponent);
            dialogRef.afterClosed().subscribe(result => {
                // console.log(`Dialog result: ${result}`);
            });
        }
    }
}

@Component({
    selector: 'contacts-created-time-dialog',
    templateUrl: 'contacts-created-time-dialog.component.html'
})
export class ContactsCreatedTimeDialogComponent implements OnInit {
    createdTimeForm : FormGroup;

    constructor(private formBuilder: FormBuilder){

    }

    ngOnInit() {
        this.createdTimeForm = this.formBuilder.group({
            createdTimeFrom : new FormControl(''),
            createdTimeTo : new FormControl(''),
        });
    }
}

@Component({
    selector: 'contacts-updated-time-dialog',
    templateUrl: 'contacts-updated-time-dialog.component.html'
})
export class ContactsUpdatedTimeDialogComponent implements OnInit{
    
    updatedTimeForm : FormGroup;

    constructor(private formBuilder: FormBuilder){

    }

    ngOnInit() {
        this.updatedTimeForm = this.formBuilder.group({
            updatedTimeFrom : new FormControl(''),
            updatedTimeTo : new FormControl(''),
        });
    }
}
