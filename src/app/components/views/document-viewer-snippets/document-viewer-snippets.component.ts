import { ChangeDetectionStrategy, Component, computed, inject, model } from "@angular/core";
import { DocumentViewerService } from "@services/document-viewer.service";
import { DocumentSnippetsStore } from "@store/document-snippets/document-snippet.store";

@Component({
  selector: "app-document-viewer-snippets",
  templateUrl: "./document-viewer-snippets.component.html",
  styleUrl: "./document-viewer-snippets.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentViewerSnippetsComponent {
  private readonly documentSnippetsStore = inject(DocumentSnippetsStore);
  private readonly documentViewerService = inject(DocumentViewerService);

  readonly isSnippetHelperDragging = model(false);

  private readonly currentDocumentSnippets = this.documentSnippetsStore.currentDocumentSnippets;

  readonly snippetsSignal = computed(() => this.currentDocumentSnippets().map(snippet => ({
    id: snippet.id,
    styles: {
      width: this.documentViewerService.getZoomedSize(snippet.width) + "px",
      height: this.documentViewerService.getZoomedSize(snippet.height) + "px",
      left: this.documentViewerService.getZoomedSize(snippet.left) + "px",
      top: this.documentViewerService.getZoomedSize(snippet.top) + "px",
    }
  })));
}
