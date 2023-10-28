import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { Contact } from "../../../interfaces/contact";
import { DatetimeService } from "../../../services/datetime/datetime.service";

@Component({
  selector: "contact-details-dialog",
  templateUrl: "contact-details.component.html",
})
export class ContactDetailsDialog {
  contact$: Observable<Contact>;

  constructor(protected datetimeService: DatetimeService) {}
}
