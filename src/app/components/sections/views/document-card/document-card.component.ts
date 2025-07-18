import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DocumentItem } from "@models/document";

@Component({
  selector: "app-document-card[document]",
  templateUrl: "./document-card.component.html",
  styleUrls: ["./document-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentCardComponent {
  @Input() document!: DocumentItem;
}
