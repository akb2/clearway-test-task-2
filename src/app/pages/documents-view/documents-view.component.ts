import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "page-documents-view",
  templateUrl: "./documents-view.component.html",
  styleUrls: ["./documents-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentsViewComponent {
}
