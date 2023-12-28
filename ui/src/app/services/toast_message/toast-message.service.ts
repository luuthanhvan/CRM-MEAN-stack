import { Injectable } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material";

@Injectable({
  providedIn: "root",
})
export class ToastMessageService {
  // some variables for the the snackbar
  label: string = "";
  setAutoHide: boolean = true;
  duration: number = 1500;
  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "bottom";

  constructor(private snackBar: MatSnackBar) {}

  showInfo(message: string) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.setAutoHide ? this.duration : 0;
    config.panelClass = ["success"];

    this.snackBar.open(message, this.label, config);
  }

  showError(message: string) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.setAutoHide ? this.duration : 0;
    config.panelClass = ["failed"];

    this.snackBar.open(message, this.label, config);
  }
}
