import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../../../interfaces/contact';

@Component({
    selector: 'contact-details-dialog',
    templateUrl: 'contact-details.component.html'
})
export class ContactDetailsDialog {
    contact$ : Observable<Contact>;

    constructor(){}
}