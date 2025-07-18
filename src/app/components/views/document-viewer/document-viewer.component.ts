import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { DocumentItem } from "@models/document";

@Component({
  selector: "app-document-viewer",
  templateUrl: "./document-viewer.component.html",
  styleUrls: ["./document-viewer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DocumentViewerComponent {
  readonly document = input<DocumentItem>();
}
