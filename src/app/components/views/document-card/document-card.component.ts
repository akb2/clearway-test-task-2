import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { DocumentItem } from "@models/document";
import { DocumentViewUrl } from "@models/route";

@Component({
  selector: "app-document-card[document]",
  templateUrl: "./document-card.component.html",
  styleUrls: ["./document-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentCardComponent {
  readonly document = input<DocumentItem>();

  readonly documentViewUrl = computed(() => {
    const document = this.document();

    return document
      ? DocumentViewUrl + document.id
      : "";
  });
}
