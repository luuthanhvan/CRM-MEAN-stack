import { Component, OnInit } from "@angular/core";
import { FormControl, FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { map, tap, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Contact } from '../../interfaces/contact'; // use contact interface
import { ContactsService } from '../../services/contacts/contacts.service'; // use contacts service
import { ContactConfirmationDialog } from './delete-dialog/confirmation-dialog.component';
import { LoadingService } from '../../services/loading/loading.service';
import { ToastMessageService } from '../../services/toast_message/toast-message.service';

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
    
    leadSrc : FormControl;
    leadSources : string[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];
    leadSrcFromDashboard : string;

    assignedTo : FormControl;
    assignedToUsers : string[];
    assignedFromDashboard : string;

    createdTimeForm : FormGroup;
    updatedTimeForm : FormGroup;
    searchControl : FormControl;

    checkArray : string[] = [];
    isDisabled : boolean = true; // it used to show/hide the mass delete button
    
    contacts$ : Observable<Contact[]>;

    constructor(private router: Router, 
                protected contactsService: ContactsService,
                public dialog: MatDialog,
                private formBuilder : FormBuilder,
                private route: ActivatedRoute,
                private loadingService : LoadingService,
                private toastMessage : ToastMessageService) {
        
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
        // get list of contacts from the database
        this.contacts$ = this.contactsService.getContacts();
        this.init();
    }

    init(){
        this.leadSrc = new FormControl('');
        this.assignedTo = new FormControl('');
        this.searchControl = new FormControl();

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
    reset(){
        // get list of contacts again
        this.contacts$ = this.contactsService.getContacts(); 
        // reset form controls
        this.init();
    }

    // navigate to edit contact page
    navigateToEdit(contactId: string) {
        let navigationExtras: NavigationExtras = {
            queryParams: { id: contactId },
        };
        this.router.navigate(["/contacts/edit"], navigationExtras);
    }

    onDelete(contactId: string, contactName: string) {
        // show confirmation dialog before detele an item
        let dialogRef = this.dialog.open(ContactConfirmationDialog, { disableClose : false });
        dialogRef.componentInstance.confirmMess = `You want to delete the "${contactName}" contact?`;
        dialogRef.afterClosed().pipe(
            tap(() => this.loadingService.showLoading()),
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(() => this.contactsService.deleteContact(contactId).pipe(
                tap((res) => {
                    if(res['status'] == 1){ // success to delete the contact
                        //  show successful message
                        // display the snackbar belong with the indicator
                        this.toastMessage.showInfo('Success to delete the contact!');
                        // reset the table
                        this.reset();
                    }
                    else {
                        // show error message
                        this.toastMessage.showError('Failed to delete the contact!');
                    }
                })
            )),
            tap(() => this.loadingService.hideLoading())
        ).subscribe();
    }
    
    // applySelectFilter(filterValue: string, filterBy : string){
    //     let contacts = this.contactsService.getContacts();
    //     if(filterBy === 'leadSrc'){
    //         this.contacts$ = contacts.pipe(map(value => value.filter(value => value.leadSrc === filterValue)));
    //     }
    //     if(filterBy === 'assignedTo'){
    //         this.contacts$ = contacts.pipe(map(value => value.filter(value => value.assignedTo === filterValue)));
    //     }
    // }

    // applySearch(form: FormControl){
    //     let contactName = form.value;
    //     let contacts = this.contactsService.getContacts();
    //     this.contacts$ = contacts.pipe(map(value => value.filter(value => value.contactName === contactName)));
    // }

    // applyDateFilter(form: FormGroup, filter: string){
    //     let contacts = this.contactsService.getContacts();
    //     if(filter === 'createdTime'){
    //         // format date and convert it to date object
    //         let fromDate = new Date(dateFormat(form.value.createdTimeFrom)),
    //         toDate = new Date(dateFormat(form.value.createdTimeTo));

    //         this.contacts$ = contacts.pipe(
    //             map(value => value.filter((value) => { 
    //                 // get date from createdTime and convert it to date object
    //                 let createdTime = new Date(value.createdTime.substring(0, value.createdTime.indexOf(', ')));
    //                 return createdTime >= fromDate && createdTime <= toDate;
    //             })));
    //     }

    //     if(filter === 'updatedTime'){
    //         let fromDate = new Date(dateFormat(form.value.updatedTimeFrom)),
    //         toDate = new Date(dateFormat(form.value.updatedTimeTo));

    //         this.dataSource = this.dataSource.filter((value) => { 
    //             let updatedTime = new Date(value.updatedTime.substring(0, value.updatedTime.indexOf(', ')));
    //             return updatedTime >= fromDate && updatedTime <= toDate;
    //         });
    //     }
    // }

    // onCheckboxClicked(e){
    //     this.isDisabled = false; // enable the Delete button
    //     if(e.target.checked){
    //         // add the checked value to array
    //         this.checkArray.push(e.target.value);
    //     }
    //     else{
    //         // remove the unchecked value from array
    //         this.checkArray.splice(this.checkArray.indexOf(e.target.value), 1);
    //     }

    //     // if there is no value in checkArray then disable the Delete button
    //     if(this.checkArray.length == 0){
    //         this.isDisabled = true;
    //     }
    // }

    // onMassDeleteBtnClicked(){
    //     const contactIds = this.checkArray;
    //     // console.log(contactIds);
    //     // show confirmation dialog before detele an item
    //     let dialogRef = this.dialog.open(ContactConfirmationDialog, { disableClose : false });
    //     dialogRef.componentInstance.confirmMess = `You want to delete the contacts?`;
    //     dialogRef.afterClosed().subscribe(
    //         (result) => {
    //             this.loadingService.showLoading();
    //             if(result){
    //                 // do confirmation action: delete the contact
    //                 this.contactsService
    //                     .deleteContacts(contactIds)
    //                     .subscribe((res) => {
    //                         this.loadingService.hideLoading();
    //                         if(res['status'] == 1){ // status = 1 => OK
    //                             // show successful message
    //                             // display the snackbar belong with the indicator
    //                             this.toastMessage.showInfo('Success to delete the contacts!');
    //                             this.reset();
    //                         }
    //                         else {
    //                             // show error message
    //                             this.toastMessage.showError('Failed to delete the contacts!');
    //                         }
    //                     });
    //             }
    //             else{
    //                 dialogRef = null;
    //             }
    //         }
    //     )
    // }
    
    // onClickedRow(row : Contact){
    //     let dialogRef = this.dialog.open(EditContactDialog, { disableClose : false, panelClass: 'formDialog' });
    //     dialogRef.componentInstance.contactId = row._id;
    //     dialogRef.afterClosed().subscribe();
    // }
}