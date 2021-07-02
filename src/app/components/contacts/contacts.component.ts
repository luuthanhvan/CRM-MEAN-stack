import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
// import { MatDialog } from '@angular/material/dialog';
import { Contact } from '../../interfaces/contact'; // use contact interface
import { ContactsService } from '../../services/contacts/contacts.service'; // use contacts service
import { dateFormat, datetimeFormat } from '../../helpers/datetime_format';
import { MatTableDataSource } from '@angular/material';

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
        "address",
        "description",
        "createdTime",
        "updatedTime",
        "modify",
        "delete",
    ];
    dataSource: Contact[] = []; // original datasource - array of objects
    dataArray : Contact[] = []; // duplicate datasource, purpose: save the original datasource for filter

    data = new MatTableDataSource(); // data displayed in the table

    leadSrc : FormControl = new FormControl('');
    leadSources : string[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];
    leadSrcFromDashboard : string;

    assignedTo : FormControl = new FormControl('');
    assignedToUsers : string[];
    assignedFromDashboard : string;

    createdTimeForm : FormGroup;
    updatedTimeForm : FormGroup;
    searchControl : FormControl = new FormControl();

    constructor(private router: Router, 
                private contactsService: ContactsService,
                /* public dialog: MatDialog, */
                private formBuilder : FormBuilder,
                private route: ActivatedRoute) {
        
        // clear params (leadSrc or assignedTo) before get all data
        this.router.navigateByUrl('/contacts');
        // get lead source passed from dashboard page
        this.route.queryParams.subscribe((params) => {
            if(params){
                if(params['leadSrc']){
                    this.leadSrcFromDashboard = params['leadSrc'];
                    this.leadSrc = new FormControl(this.leadSrcFromDashboard);
                }
                if(params['assignedTo']){
                    this.assignedFromDashboard = params['assignedTo'];
                    this.assignedTo = new FormControl(this.assignedFromDashboard);
                }
            }
        });
    }

    ngOnInit() {
        // get list of contacts
        this.contactsService.getContacts().subscribe((data) => {
            // get list of assigned to
            this.assignedToUsers = data.map(value => value.assignedTo);
            // Remove array duplicate
            this.assignedToUsers = [...new Set(this.assignedToUsers)];

            this.dataSource = data.map((value, index) => {
                value.no = index+1;
                // format datetime to display
                value.createdTime = datetimeFormat(value.createdTime);
                value.updatedTime = datetimeFormat(value.updatedTime);
                return value;
            });
            this.dataArray = this.dataSource; // store the original datasource

            // filter automatically
            // if leadSrc (a param) got from dashboard, then filter the datasource by the leadSrc
            if(this.leadSrcFromDashboard != undefined)
                this.dataSource = data.filter(value => value.leadSrc === this.leadSrcFromDashboard);
            
            // if assignedTo (a param) got from dashboard, then filter the datasource by the assignedTo
            if(this.assignedFromDashboard != undefined)
                this.dataSource = data.filter(value => value.assignedTo === this.assignedFromDashboard);

            // assign the datasource to data displayed in the table
            this.data = new MatTableDataSource(this.dataSource);
            this.dataSource = this.dataArray; // restore the datasource
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
        // get list of contacts
        this.contactsService.getContacts().subscribe((data) => {
            // get list of assigned to
            this.assignedToUsers = data.map(value => value.assignedTo);
            // Remove array duplicate
            this.assignedToUsers = [...new Set(this.assignedToUsers)];

            this.dataSource = data.map((value, index) => {
                value.no = index+1;
                // format datetime to display
                value.createdTime = datetimeFormat(value.createdTime);
                value.updatedTime = datetimeFormat(value.updatedTime);
                return value;
            });
            this.dataArray = this.dataSource; // store the original datasource
            this.data = new MatTableDataSource(this.dataSource);
        });

        // reset form controls
        this.leadSrc = new FormControl('');
        this.assignedTo = new FormControl('');

        this.createdTimeForm = this.formBuilder.group({
            createdTimeFrom : new FormControl(),
            createdTimeTo : new FormControl(),
        });

        this.updatedTimeForm = this.formBuilder.group({
            updatedTimeFrom : new FormControl(),
            updatedTimeTo : new FormControl(),
        });
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

    applySelectFilter(filterValue: string, filterBy : string){
        if(filterBy === 'leadSrc')
            this.dataSource =  this.dataSource.filter(value => value.leadSrc === filterValue);
        if(filterBy === 'assignedTo')
            this.dataSource =  this.dataSource.filter(value => value.assignedTo === filterValue);
        
        this.data = new MatTableDataSource(this.dataSource);
        this.dataSource = this.dataArray;
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
