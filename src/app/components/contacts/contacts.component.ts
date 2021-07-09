import { Component, OnInit } from "@angular/core";
import { FormControl, FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';

import { Contact } from '../../interfaces/contact'; // use contact interface
import { ContactsService } from '../../services/contacts/contacts.service'; // use contacts service
import { dateFormat, datetimeFormat } from '../../helpers/datetime_format';
// import { EditContactDialog } from './edit-dialog/contacts-edit-dialog.component';
import { ContactConfirmationDialog } from './delete-dialog/confirmation-dialog.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { snackbarConfig } from '../../helpers/snackbar_config';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
    selector: "app-contacts",
    templateUrl: "./contacts.component.html",
    styleUrls: ["./contacts.component.scss"],
})

export class ContactsComponent implements OnInit {
    displayedColumns: string[] = [
        "check",
        "contactName",
        "salutation",
        "leadSrc",
        "assignedTo",
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

    // some variables for the the snackbar (a kind of toast message)
    label: string = '';
    setAutoHide: boolean = true;
    duration: number = 1500;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    form: FormGroup;
    isShowMassDelete : boolean = false; // it used to show/hide the mass delete button
    
    constructor(private router: Router, 
                private contactsService: ContactsService,
                public dialog: MatDialog,
                private formBuilder : FormBuilder,
                private route: ActivatedRoute,
                public snackBar: MatSnackBar,
                private loadingService: LoadingService) {
        
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

        this.form = this.formBuilder.group({
            checkArray : this.formBuilder.array([])
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

    onDelete(contactId: string, contactName: string) {
        // show confirmation dialog before detele an item
        let dialogRef = this.dialog.open(ContactConfirmationDialog, { disableClose : false });
        dialogRef.componentInstance.confirmMess = `You want to delete the "${contactName}" contact?`;
        dialogRef.afterClosed().subscribe(
            (result) => {
                this.loadingService.showLoading();
                if(result){
                    // do confirmation action: delete the contact
                    this.contactsService
                        .deleteContact(contactId)
                        .subscribe((res) => {
                            this.loadingService.hideLoading();
                            if(res['status'] == 1){ // status = 1 => OK
                                // show successful message
                                // display the snackbar belong with the indicator
                                let config = snackbarConfig(this.verticalPosition, this.horizontalPosition, this.setAutoHide, this.duration, ['success']);
                                this.snackBar.open('Success to delete the contact!', this.label, config);
                                window.location.reload(); // reload contacts page
                            }
                            else {
                                // show error message
                                let config = snackbarConfig(this.verticalPosition, this.horizontalPosition, this.setAutoHide, this.duration, ['failed']);
                                this.snackBar.open('Failed to delete the contact!', this.label, config);
                            }
                        });
                }
                else{
                    dialogRef = null;
                }
            }
        )
    }

    onCheckboxClicked(e){
        this.isShowMassDelete = true;
        const checkArray: FormArray = this.form.get('checkArray') as FormArray;

        if(e.target.checked){
            checkArray.push(new FormControl(e.target.value));
        }
        else {
            let i : number = 0;
            checkArray.controls.forEach((item: FormControl) => {
                if(item.value == e.target.value){
                    checkArray.removeAt(i);
                    return;
                }
                i++;
            })
        }

        if(checkArray.length == 0){
            this.isShowMassDelete = false;
        }
    }

    onMassDeleteBtnClicked(){
        const contactIds = this.form.value;
        // show confirmation dialog before detele an item
        let dialogRef = this.dialog.open(ContactConfirmationDialog, { disableClose : false });
        dialogRef.componentInstance.confirmMess = `You want to delete the contacts?`;
        dialogRef.afterClosed().subscribe(
            (result) => {
                this.loadingService.showLoading();
                if(result){
                    // do confirmation action: delete the contact
                    this.contactsService
                        .deleteContacts(contactIds)
                        .subscribe((res) => {
                            this.loadingService.hideLoading();
                            if(res['status'] == 1){ // status = 1 => OK
                                // show successful message
                                // display the snackbar belong with the indicator
                                let config = snackbarConfig(this.verticalPosition, this.horizontalPosition, this.setAutoHide, this.duration, ['success']);
                                this.snackBar.open('Success to delete the contacts!', this.label, config);
                                window.location.reload(); // reload contacts page
                            }
                            else {
                                // show error message
                                let config = snackbarConfig(this.verticalPosition, this.horizontalPosition, this.setAutoHide, this.duration, ['failed']);
                                this.snackBar.open('Failed to delete the contacts!', this.label, config);
                            }
                        });
                }
                else{
                    dialogRef = null;
                }
            }
        )
    }
    
    // onClickedRow(row : Contact){
    //     let dialogRef = this.dialog.open(EditContactDialog, { disableClose : false, panelClass: 'formDialog' });
    //     dialogRef.componentInstance.contactId = row._id;
    //     dialogRef.afterClosed().subscribe();
    // }
}