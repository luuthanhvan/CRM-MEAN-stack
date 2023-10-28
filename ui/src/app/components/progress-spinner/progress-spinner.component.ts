import { Component } from "@angular/core";

import { LoadingService } from "../../services/loading/loading.service";

@Component({
  selector: "app-progress-spinner",
  templateUrl: "./progress-spinner.component.html",
  styleUrls: ["./progress-spinner.component.scss"],
})
export class ProgressSpinnerComponent {
  constructor(protected loadingService: LoadingService) {}
}
