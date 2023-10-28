import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { UserManagementService } from "../../../services/user_management/user-management.service";
import { LoadingService } from "../../../services/loading/loading.service";
import { ToastMessageService } from "../../../services/toast_message/toast-message.service";

@Component({
  selector: "app-add-user",
  templateUrl: "./add.component.html",
})
export class AddUserComponent implements OnInit {
  userFormInfo: FormGroup = this.userService.initUser();
  submitted = false;

  constructor(
    protected router: Router,
    private userService: UserManagementService,
    private loadingService: LoadingService,
    private toastMessage: ToastMessageService
  ) {}

  ngOnInit() {
    // form draft save
    const draft = window.localStorage.getItem("user");
    if (draft) {
      this.userFormInfo.setValue(JSON.parse(draft));
    }

    this.userFormInfo.valueChanges.subscribe((data) => {
      window.localStorage.setItem("user", JSON.stringify(data));
    });
  }

  get contactFormControl() {
    return this.userFormInfo.controls;
  }

  onSubmit(form: FormGroup) {
    this.submitted = true;
    let userInfo = form.value;
    userInfo.createdTime = new Date();

    // clear local storage
    window.localStorage.removeItem("user");

    this.loadingService.showLoading();
    this.userService
      .addUser(userInfo)
      .pipe(
        tap((res) => {
          this.loadingService.hideLoading();
          if (res["status"] == 1) {
            // status = 1 => OK
            // show successful message
            // display the snackbar belong with the indicator
            this.toastMessage.showInfo("Success to add a new user!");
            this.router.navigate(["/user_management"]);
          } else {
            // show error message
            this.toastMessage.showError("Failed to add a new user!");
          }
        })
      )
      .subscribe();
  }
}
