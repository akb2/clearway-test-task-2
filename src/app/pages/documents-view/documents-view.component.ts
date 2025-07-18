import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { DocumentStore } from "@store/document/document.store";

@Component({
  selector: "page-documents-view",
  templateUrl: "./documents-view.component.html",
  styleUrls: ["./documents-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentsViewComponent {
  private readonly documentStore = inject(DocumentStore);

  readonly document = this.documentStore.viewingDocument;
}
