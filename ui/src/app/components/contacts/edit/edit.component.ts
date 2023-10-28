import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import {
  tap,
  switchMap,
  debounceTime,
  distinctUntilChanged,
} from "rxjs/operators";
import { User } from "../../../interfaces/user";
import { ContactsService } from "../../../services/contacts/contacts.service";
import { UserManagementService } from "../../../services/user_management/user-management.service";
import { LoadingService } from "../../../services/loading/loading.service";
import { ToastMessageService } from "../../../services/toast_message/toast-message.service";
import { AuthService } from "../../../services/auth/auth.service";

@Component({
  selector: "app-edit-contact",
  templateUrl: "./edit.component.html",
})
export class EditContactsComponent implements OnInit {
  contactFormInfo: FormGroup;
  salutations: string[] = ["None", "Mr.", "Mrs.", "Ms.", "Dr.", "Prof."];
  leadSources: string[] = [
    "Existing Customer",
    "Partner",
    "Conference",
    "Website",
    "Word of mouth",
    "Other",
  ];
  contactId: string;
  createdTime: string;
  submitted = false;
  assignedToUsers$: Observable<User[]>;

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    protected contactsService: ContactsService,
    private userService: UserManagementService,
    private loadingService: LoadingService,
    private toastMessage: ToastMessageService,
    private authService: AuthService
  ) {
    // get contact ID from contact page
    this.route.queryParams.subscribe((params) => {
      this.contactId = params["id"];
    });

    this.contactFormInfo = this.contactsService.initContact();
    this.assignedToUsers$ = this.authService.getUser().pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((user) => {
        if (!user.isAdmin) {
          return of(null);
        }
        return this.userService.getUsers();
      })
    );
  }

  ngOnInit() {
    // load contact information to the contact form
    this.contactsService
      .getContact(this.contactId)
      .pipe(
        tap((contact) => {
          this.contactFormInfo.setValue({
            contactName: contact.contactName,
            salutation: contact.salutation,
            mobilePhone: contact.mobilePhone,
            email: contact.email,
            organization: contact.organization,
            dob: contact.dob,
            leadSrc: contact.leadSrc,
            assignedTo: contact.assignedTo,
            address: contact.address,
            description: contact.description,
          });
          this.createdTime = contact.createdTime; // to keep the created time when update a contact information
        })
      )
      .subscribe();
  }

  get contactFormControl() {
    return this.contactFormInfo.controls;
  }

  // function to handle update a contact
  onUpdate(form: FormGroup) {
    this.submitted = true;
    let contactInfo = form.value;
    contactInfo.createdTime = this.createdTime;
    contactInfo.updatedTime = new Date();
    this.loadingService.showLoading();
    this.contactsService
      .updateContact(this.contactId, contactInfo)
      .pipe(
        tap((res) => {
          this.loadingService.hideLoading();
          if (res["status"] == 1) {
            // show successful message
            // display the snackbar belong with the indicator
            this.toastMessage.showInfo("Success to save the contact!");
            this.router.navigateByUrl("/contacts");
          } else {
            // show error message
            this.toastMessage.showError("Failed to save the contact!");
          }
        })
      )
      .subscribe();
  }
}
