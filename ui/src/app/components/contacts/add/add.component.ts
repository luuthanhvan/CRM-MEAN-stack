import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "../../../interfaces/user";
import { ContactsService } from "../../../services/contacts/contacts.service"; // use contacts service
import { UserManagementService } from "../../../services/user_management/user-management.service"; // use user service
import { LoadingService } from "../../../services/loading/loading.service";
import { ToastMessageService } from "../../../services/toast_message/toast-message.service";
import { AuthService } from "../../../services/auth/auth.service";

@Component({
  selector: "app-add-contact",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AddContactComponent implements OnInit {
  contactFormInfo: FormGroup = this.contactsService.initContact();
  salutations: string[] = ["None", "Mr.", "Mrs.", "Ms.", "Dr.", "Prof."];
  leadSources: string[] = [
    "Existing Customer",
    "Partner",
    "Conference",
    "Website",
    "Word of mouth",
    "Other",
  ];
  submitted = false;
  assignedToUsers$: Observable<User[]>;
  creator: string;
  show: boolean = true;

  constructor(
    protected contactsService: ContactsService,
    private userService: UserManagementService,
    protected router: Router,
    private loadingService: LoadingService,
    private toastMessage: ToastMessageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // form draft save
    const draft = window.localStorage.getItem("contact");
    if (draft) {
      this.contactFormInfo.setValue(JSON.parse(draft));
    }

    this.contactFormInfo.valueChanges.subscribe((data) => {
      window.localStorage.setItem("contact", JSON.stringify(data));
    });

    this.assignedToUsers$ = this.userService.getUsers().pipe(
      tap((data) => {
        if (data.length == 1) {
          this.contactFormInfo.controls.assignedTo.setValue(data[0].name);
          this.show = false;
        }
      })
    );

    this.authService
      .me()
      .pipe(tap((user) => (this.creator = user.name)))
      .subscribe();
  }

  get contactFormControl() {
    return this.contactFormInfo.controls;
  }

  // function to handle upload contact information to server
  onSubmit(form: FormGroup) {
    this.submitted = true;
    const contactInfo = form.value;
    contactInfo.createdTime = new Date();
    contactInfo.updatedTime = new Date();
    contactInfo.creator = this.creator;

    // clear local storage
    window.localStorage.removeItem("contact");

    this.loadingService.showLoading();
    this.contactsService
      .addContact(contactInfo)
      .pipe(
        tap((res) => {
          // implement side effects
          this.loadingService.hideLoading();
          if (res["status"] == 1) {
            // show successful message
            // display the snackbar belong with the indicator
            this.toastMessage.showInfo("Success to add a new contact!");
            this.router.navigateByUrl("/contacts"); // navigate back to the contacts page
          } else {
            // show error message
            this.toastMessage.showError("Failed to add a new contact!");
          }
        })
      )
      .subscribe();
  }
}
