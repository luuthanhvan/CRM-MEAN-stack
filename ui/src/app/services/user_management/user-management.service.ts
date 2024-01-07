import { Injectable } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { map, shareReplay, takeUntil, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../../interfaces/user";
// import custom validator to validate that password and confirm password fields match
import { MustMatch } from "../../helpers/validation_functions";

@Injectable({
  providedIn: "root",
})
export class UserManagementService {
  SERVER_URL: string = "http://localhost:4040/user_management";
  private stop$: Subject<void> = new Subject<void>();
  noAuthHeader = { headers: new HttpHeaders({ NoAuth: "True" }) };

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) {}

  initUser() {
    return this.formBuilder.group(
      {
        name: new FormControl("", [Validators.required]),
        username: new FormControl("", [Validators.required]),
        password: new FormControl("", [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmPassword: new FormControl("", [Validators.required]),
        email: new FormControl("", [Validators.required, Validators.email]),
        phone: new FormControl("", [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
        ]),
        isAdmin: new FormControl(false),
        isActive: new FormControl(false),
      },
      {
        validators: MustMatch("password", "confirmPassword"),
      }
    );
  }

  // add user
  addUser(userInfo: User): Observable<void> {
    return this.httpClient.post<void>(this.SERVER_URL, userInfo);
  }

  // create new user
  createUser(userInfo): Observable<void> {
    return this.httpClient.post<void>(`${this.SERVER_URL}/create`, userInfo);
  }

  // get list of users
  getUsers(): Observable<User[]> {
    return this.httpClient
      .post<User[]>(`${this.SERVER_URL}/list`, this.noAuthHeader)
      .pipe(
        map((res) => res["data"]["users"] || [res["data"]["user"]]),
        takeUntil(this.stop$),
        shareReplay()
      );
  }

  // get a user by user ID
  getUser(userId: string): Observable<User> {
    return this.httpClient.get<User>(`${this.SERVER_URL}/${userId}`).pipe(
      map((res) => res["data"]["user"]),
      takeUntil(this.stop$)
    );
  }

  // update a user by user ID
  updateUser(userId: string, userInfo: User): Observable<void> {
    return this.httpClient
      .put<void>(`${this.SERVER_URL}/${userId}`, userInfo)
      .pipe(takeUntil(this.stop$));
  }

  changePassword(userId: string, newPass: string): Observable<void> {
    return this.httpClient
      .post<void>(`${this.SERVER_URL}/${userId}`, { newPass: newPass })
      .pipe(takeUntil(this.stop$));
  }

  // stop subcriptions
  stop() {
    this.stop$.next();
    this.stop$.complete();
  }
}
