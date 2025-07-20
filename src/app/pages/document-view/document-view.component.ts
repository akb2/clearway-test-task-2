import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { DocumentStore } from "@store/document/document.store";

@Component({
  selector: "page-document-view",
  templateUrl: "./document-view.component.html",
  styleUrls: ["./document-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentViewComponent {
  private readonly documentStore = inject(DocumentStore);

  readonly documents = this.documentStore.documents;
  readonly viewingDocumentId = this.documentStore.viewingDocumentId;
}
