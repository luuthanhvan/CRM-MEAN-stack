import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactsService } from '../../../services/contacts/contacts.service'; // use contacts service
import { UserManagementService } from '../../../services/user_management/user-management.service'; // use user service
import { ToastMessageService } from '../../../services/toast_message/toast-message.service';
import { LoadingService } from '../../../services/loading/loading.service';

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
    users : Object;
    submitted = false;
    sucessfulMessage: string = 'Success to add a new contact!';
    errorMessage: string = 'Failed to add a new contact!';

    constructor(protected contactsService : ContactsService,
                private userService : UserManagementService,
                protected router : Router,
                private loadingService: LoadingService,
                private toastMessage: ToastMessageService){
    }

    ngOnInit(){
        this.contactFormInfo = this.contactsService.initContact();
        // get list of users from database and display them to the Assigned field in the contactFormInfo
        this.userService
            .getUsers()
            .subscribe((data) => {
                this.users = data.map((value) => {
                    return {userId: value._id,
                            name: value.name};
                });      
            });
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
        this.contactsService.addContact(contactInfo).subscribe(
            (res) => {
                this.loadingService.hideLoading();
                if(res['status'] == 1){ // status = 1 => OK
                    // show successful message
                    // display the snackbar belong with the indicator
                    this.toastMessage.showInfo(this.sucessfulMessage);
                    this.router.navigateByUrl('/contacts'); // navigate back to the contacts page
                }
                else {
                    // show error message
                    this.toastMessage.showError(this.errorMessage);
                }
            }
        );
    }
}