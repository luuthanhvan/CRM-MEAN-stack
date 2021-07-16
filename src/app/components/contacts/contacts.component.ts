import { Component, OnInit } from "@angular/core";
import { FormControl, FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { Observable, BehaviorSubject, of, combineLatest } from 'rxjs';
import { map, tap, switchMap, distinctUntilChanged, debounceTime, startWith } from 'rxjs/operators';
import { Contact } from '../../interfaces/contact'; // use contact interface
import { ContactsService } from '../../services/contacts/contacts.service'; // use contacts service
import { ContactConfirmationDialog } from './delete-dialog/confirmation-dialog.component';
import { LoadingService } from '../../services/loading/loading.service';
import { ToastMessageService } from '../../services/toast_message/toast-message.service';
import { ContactDetailsDialog } from './contact-details/contact-details.component';

interface FilterCriteria {
    leadSrc?: string,
    assignedTo?: string,
    contactName?: string
}

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
    
    leadSources : string[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];
    leadSrcFromDashboard : string;
    assignedFromDashboard : string;
    assignedToUsers : string[] = [];
    
    assignedTo : FormControl;
    leadSrc : FormControl;
    searchText : FormControl;
    createdTimeForm : FormGroup;
    updatedTimeForm : FormGroup;

    checkArray : string[] = [];
    isDisabled : boolean = true; // it used to show/hide the mass delete button
    
    contacts$ : Observable<Contact[]>;
    search$ : Observable<Contact[]>;
    result$ : Observable<any>;
    filterSubject: BehaviorSubject<FilterCriteria> = new BehaviorSubject<FilterCriteria>({});

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
        this.init();
    }

    init(){
        this.leadSrc = new FormControl('');
        this.assignedTo = new FormControl('');
        this.searchText = new FormControl('');

        this.createdTimeForm = this.formBuilder.group({
            createdTimeFrom : new FormControl(),
            createdTimeTo : new FormControl(),
        });

        this.updatedTimeForm = this.formBuilder.group({
            updatedTimeFrom : new FormControl(),
            updatedTimeTo : new FormControl(),
        });

        this.search$ = this.searchText.valueChanges.pipe(
            startWith(''),
            tap((contactName) => { console.log(contactName) }),
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((contactName) => contactName ? this.contactsService.searchContact(contactName) : of(null)),
            map(res => res && res['data'] && res['data']['contacts'])
        );

        this.contacts$ = combineLatest([this.contactsService.getContacts(), this.filterSubject, this.search$]).pipe(
            map(([contacts, {leadSrc, assignedTo, contactName}, searchResult]) => {
                const sourceData = searchResult ? searchResult : contacts;
                return sourceData.filter(d => {
                    return (leadSrc ? d.leadSrc === leadSrc : true) && 
                        (assignedTo ? d.assignedTo === assignedTo : true);
                });
            })
        );
    }

    // function to reset the table
    reset(){
        this.filterSubject.next({});
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

    applySelectFilter(filterValue: string, filterBy : string){
        const currentFilterObj = this.filterSubject.getValue();
        this.filterSubject.next({...currentFilterObj, [filterBy]: filterValue});
    }

    onDelete(contactId: string, contactName: string) {
        // show confirmation dialog before detele an item
        let dialogRef = this.dialog.open(ContactConfirmationDialog, { disableClose : false });
        dialogRef.componentInstance.confirmMess = `You want to delete the "${contactName}" contact?`;
        dialogRef.afterClosed().pipe(
            tap(() => this.loadingService.showLoading()),
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((result) => {
                if(!result){
                    return of(0);
                }
                return this.contactsService.deleteContact(contactId).pipe(
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
                );
            }),
            tap(() => this.loadingService.hideLoading())
        ).subscribe();
    }
    
    onCheckboxClicked(e){
        this.isDisabled = false; // enable the Delete button
        if(e.target.checked){
            // add the checked value to array
            this.checkArray.push(e.target.value);
        }
        else{
            // remove the unchecked value from array
            this.checkArray.splice(this.checkArray.indexOf(e.target.value), 1);
        }

        // if there is no value in checkArray then disable the Delete button
        if(this.checkArray.length == 0){
            this.isDisabled = true;
        }
    }

    onMassDeleteBtnClicked(){
        const contactIds = this.checkArray;
        // show confirmation dialog before detele an item
        let dialogRef = this.dialog.open(ContactConfirmationDialog, { disableClose : false });
        dialogRef.componentInstance.confirmMess = `You want to delete the contacts?`;
        dialogRef.afterClosed().pipe(
            tap(() => this.loadingService.showLoading()),
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((result) => {
                if(!result){
                    return of(0);
                }
                return this.contactsService.deleteContacts(contactIds).pipe(
                    tap((res) => {
                        if(res['status'] == 1){ // success to delete the contact
                            //  show successful message
                            // display the snackbar belong with the indicator
                            this.toastMessage.showInfo('Success to delete the contacts!');
                            // reset the table
                            this.reset();
                        }
                        else {
                            // show error message
                            this.toastMessage.showError('Failed to delete the contacts!');
                        }
                    })
                );
            }),
            tap(() => this.loadingService.hideLoading())
        ).subscribe()
    }

    onClickedRow(contactId : string){
        const contact = this.contactsService.getContact(contactId);

        let dialogRef = this.dialog.open(ContactDetailsDialog, { disableClose : false, panelClass: 'customDialog'});
        dialogRef.componentInstance.contact$ = contact;
        dialogRef.afterClosed().subscribe();
    }
}