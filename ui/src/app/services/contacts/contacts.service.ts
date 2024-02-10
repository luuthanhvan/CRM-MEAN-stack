import { Injectable } from "@angular/core";
import { Contact } from "../../interfaces/contact";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { map, shareReplay, takeUntil } from "rxjs/operators";
import * as environment  from "../../../assets/environment.json";

@Injectable({
  providedIn: "root",
})
export class ContactsService {
  SERVER_URL: string = environment.baseUrl + "/contacts";
  private stop$: Subject<void> = new Subject<void>();
  noAuthHeader = { headers: new HttpHeaders({ NoAuth: "True" }) };

  constructor(
    private httpClient: HttpClient,
    private formBuilder: FormBuilder
  ) {}

  initContact() {
    return this.formBuilder.group({
      contactName: new FormControl("", [Validators.required]),
      salutation: new FormControl([], [Validators.required]),
      mobilePhone: new FormControl("", [
        Validators.required,
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
      ]),
      email: new FormControl("", [Validators.email]),
      organization: new FormControl(""),
      dob: new FormControl(""),
      leadSrc: new FormControl([], [Validators.required]),
      assignedTo: new FormControl([], [Validators.required]),
      address: new FormControl(""),
      description: new FormControl(""),
    });
  }

  // add a contact
  addContact(contact: Contact): Observable<void> {
    return this.httpClient
      .post<void>(this.SERVER_URL, contact)
      .pipe(takeUntil(this.stop$));
  }

  // fetch list of contacts
  getContacts(): Observable<Contact[]> {
    return this.httpClient
      .post<Contact[]>(`${this.SERVER_URL}/list`, this.noAuthHeader)
      .pipe(
        map((res) => res["data"]["contacts"]),
        takeUntil(this.stop$),
        shareReplay()
      );
  }

  // get a contact by contact ID
  getContact(contactId: string): Observable<Contact> {
    return this.httpClient.get<Contact>(`${this.SERVER_URL}/${contactId}`).pipe(
      map((res) => res["data"]["contact"]),
      takeUntil(this.stop$)
    );
  }

  // update a contact by contact ID
  updateContact(contactId: string, contact: Contact): Observable<void> {
    return this.httpClient
      .put<void>(`${this.SERVER_URL}/${contactId}?_method=PUT`, contact)
      .pipe(takeUntil(this.stop$));
  }

  // delete a contact by contact ID
  deleteContact(contactId: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.SERVER_URL}/${contactId}?_method=DELETE`)
      .pipe(takeUntil(this.stop$));
  }

  // delete multi contacts by list of contact ID
  deleteContacts(contactIds: string[]): Observable<void> {
    return this.httpClient
      .post<void>(`${this.SERVER_URL}/delete`, contactIds)
      .pipe(takeUntil(this.stop$));
  }

  searchContact(contactName: string): Observable<Contact[]> {
    return this.httpClient.get<Contact[]>(
      `${this.SERVER_URL}/search/${contactName}`
    );
  }

  // stop subcriptions
  stop() {
    this.stop$.next();
    this.stop$.complete();
  }
}
