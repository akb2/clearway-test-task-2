import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DocumentItem } from "@app/models/document";

@Component({
  selector: "app-document-card",
  templateUrl: "./document-card.component.html",
  styleUrls: ["./document-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentCardComponent {
  @Input() document?: DocumentItem;
}
