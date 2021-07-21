import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { User } from '../../../interfaces/user';
import { ContactsService } from '../../../services/contacts/contacts.service'; // use contacts service
import { UserManagementService } from '../../../services/user_management/user-management.service'; // use user service
import { LoadingService } from '../../../services/loading/loading.service';
import { ToastMessageService } from '../../../services/toast_message/toast-message.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
    selector: 'app-add-contact',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AddContactComponent implements OnInit{
    contactFormInfo: FormGroup; // typescript variable declaration
    salutations : string[] =  ['None', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
    leadSources : string[] = ['Existing Customer', 'Partner', 'Conference', 'Website', 'Word of mouth', 'Other'];
    submitted = false;
    assignedToUsers$ : Observable<User[]>;

    constructor(protected contactsService : ContactsService,
                private userService : UserManagementService,
                protected router : Router,
                private loadingService: LoadingService,
                private toastMessage: ToastMessageService,
                private authService: AuthService){
    }

    ngOnInit(){
        this.contactFormInfo = this.contactsService.initContact();
        this.assignedToUsers$ = this.authService.getUser().pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((user) => {
                if(!user.isAdmin){
                    this.contactFormInfo.controls.assignedTo.setValue(user.name);
                    return of(null);
                }
                return this.userService.getUsers();
            })
        );
    }

    get contactFormControl(){
        return this.contactFormInfo.controls;
    }

    // function to handle upload contact information to server
    onSubmit(form: FormGroup){
        this.submitted = true;
        let contactInfo = form.value;
        contactInfo.createdTime = new Date();
        contactInfo.updatedTime = new Date();

        this.loadingService.showLoading();
        this.contactsService.addContact(contactInfo).pipe(
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
        ).subscribe();
    }
}