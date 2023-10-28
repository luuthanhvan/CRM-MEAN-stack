import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { share } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  private loadingSubject$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor() {}

  showLoading() {
    this.loadingSubject$.next(true);
  }

  hideLoading() {
    this.loadingSubject$.next(false);
  }

  isVisible(): Observable<boolean> {
    return this.loadingSubject$.asObservable().pipe(share());
  }
}
