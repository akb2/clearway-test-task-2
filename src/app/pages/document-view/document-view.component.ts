import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "page-document-view",
  templateUrl: "./document-view.component.html",
  styleUrls: ["./document-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentViewComponent { }
