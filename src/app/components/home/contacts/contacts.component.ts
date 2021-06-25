import { Component, OnInit } from "@angular/core";
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";
import { Router, NavigationExtras } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { Contact } from '../../../interfaces/contact'; // use contact interface
import { ContactsService } from '../../../services/contacts/contacts.service'; // use contacts service
import { dateFormat, datetimeFormat } from '../../../helpers/datetime_format';
import { MatTableDataSource } from '@angular/material';

@Component({
    selector: "app-contacts",
    templateUrl: "./contacts.component.html",
    styleUrls: ["./contacts.component.scss"],
})

// get list of contacts

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
        "address",
        "description",
        "createdTime",
        "updatedTime",
        "modify",
        "delete",
    ];
    dataSource: Contact[] = []; // original datasource 
    dataArray : Contact[] = []; // duplicate datasource, purpose: save the original datasource for filter

    data = new MatTableDataSource();

    leadSources : string[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];
    leadSrc : FormControl = new FormControl();
    
    createdTimeForm : FormGroup;
    updatedTimeForm : FormGroup;
    searchControl : FormControl = new FormControl();

    constructor(private router: Router, 
                private contactsService: ContactsService,
                public dialog: MatDialog,
                private formBuilder : FormBuilder) {}

    ngOnInit() {
        // get list of contacts
        this.contactsService.getContacts().subscribe((data) => {
            this.dataSource = data.map((value, index) => {
                value.no = index+1;
                // format datetime to display
                value.createdTime = datetimeFormat(value.createdTime);
                value.updatedTime = datetimeFormat(value.updatedTime);
                return value;
            });

            this.data = new MatTableDataSource(this.dataSource);
            this.dataArray = this.dataSource;
        });

        this.createdTimeForm = this.formBuilder.group({
            createdTimeFrom : new FormControl(),
            createdTimeTo : new FormControl(),
        });

        this.updatedTimeForm = this.formBuilder.group({
            updatedTimeFrom : new FormControl(),
            updatedTimeTo : new FormControl(),
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

    applySelectFilter(filterValue: string){
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.data.filter = filterValue;
    }

    applyDateFilter(form: FormGroup, filter: string){

        if(filter === 'createdTime'){
            // format date and convert it to date object
            let fromDate = new Date(dateFormat(form.value.createdTimeFrom)),
            toDate = new Date(dateFormat(form.value.createdTimeTo));

            this.dataSource = this.dataSource.filter((value) => { 
                // get date from createdTime and convert it to date object
                let createdTime = new Date(value.createdTime.substring(0, value.createdTime.indexOf(', ')));
                return createdTime >= fromDate && createdTime <= toDate;
            });
        }

        if(filter === 'updatedTime'){
            let fromDate = new Date(dateFormat(form.value.updatedTimeFrom)),
            toDate = new Date(dateFormat(form.value.updatedTimeTo));

            this.dataSource = this.dataSource.filter((value) => { 
                let updatedTime = new Date(value.updatedTime.substring(0, value.updatedTime.indexOf(', ')));
                return updatedTime >= fromDate && updatedTime <= toDate;
            });
        }

        this.data = new MatTableDataSource(this.dataSource);
        this.dataSource = this.dataArray;
    }

    applySearch(form: FormControl){
        let contactName = form.value;
        let result : Contact[] = [];
        for(let i = 0; i < this.dataSource.length; i++){
            if(this.dataSource[i].contactName === contactName){
                result.push(this.dataSource[i]);
            }
        }

        this.data = new MatTableDataSource(result);
    }

    clearSearch(){
        this.data = new MatTableDataSource(this.dataArray);
        this.searchControl = new FormControl('');
    }

    /*
    openDialog(dialogName : string){
        if(dialogName === 'createdTime'){
            let dialogRef = this.dialog.open(ContactsCreatedTimeDialogComponent);
            dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
            });
        }

        else if(dialogName === 'updatedTime'){
            let dialogRef = this.dialog.open(ContactsUpdatedTimeDialogComponent);
            dialogRef.afterClosed().subscribe(result => {
                // console.log(`Dialog result: ${result}`);
            });
        }
    } */
}

/*
@Component({
    selector: 'contacts-created-time-dialog',
    templateUrl: 'contacts-created-time-dialog.component.html'
})
export class ContactsCreatedTimeDialogComponent implements OnInit {
    createdTimeForm : FormGroup;
    dataSource: Contact[] = [];
    data = new MatTableDataSource();

    constructor(private formBuilder: FormBuilder,
        private contactsService: ContactsService){
            
        this.createdTimeForm = this.formBuilder.group({
            fromDate : new FormControl(''),
            toDate : new FormControl(''),
        });

        // get list of contacts
        this.contactsService.getContacts().subscribe((data) => {
            this.dataSource = data.map((value, index) => {
                value.no = index+1;
                // value.createdTime = datetimeFormat(value.createdTime);
                // value.updatedTime = datetimeFormat(value.updatedTime);
                return value;
            });

            this.data = new MatTableDataSource(this.dataSource);
        });
    }

    get fromDate() { return this.createdTimeForm.get('fromDate').value; }
    get toDate() { return this.createdTimeForm.get('toDate').value; }

    ngOnInit() {
    }

    applyFilter(form: FormGroup){
        console.log(new Date(this.dataSource[0].createdTime));
        let fromDate = datetimeFormat(form.value.fromDate),
            toDate = datetimeFormat(form.value.toDate);
        
        
        let filterValue = this.dataSource.filter((value) => value.createdTime > fromDate && value.createdTime < toDate);

        this.data = new MatTableDataSource(filterValue);
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
} */
