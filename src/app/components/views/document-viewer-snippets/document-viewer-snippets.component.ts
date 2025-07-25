import { ChangeDetectionStrategy, Component, computed, inject, model } from "@angular/core";
import { DocumentViewerService } from "@services/document-viewer.service";
import { DocumentSnippetsStore } from "@store/document-snippets/document-snippet.store";
import { DocumentViewerStore } from "@store/document-viewer/document-viewer.store";

@Component({
  selector: "app-document-viewer-snippets",
  templateUrl: "./document-viewer-snippets.component.html",
  styleUrl: "./document-viewer-snippets.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentViewerSnippetsComponent {
  private readonly documentSnippetsStore = inject(DocumentSnippetsStore);
  private readonly documentViewerStore = inject(DocumentViewerStore);
  private readonly documentViewerService = inject(DocumentViewerService);

  readonly isSnippetHelperDragging = model(false);

  private readonly currentDocumentSnippets = this.documentSnippetsStore.currentDocumentSnippets;
  private readonly zoomKoeff = this.documentViewerStore.zoomKoeff;
  private readonly imageByElmScaled = this.documentViewerStore.imageByElmScaled;

  readonly snippetsSignal = computed(() => {
    const snippets = this.currentDocumentSnippets();
    const zoomKoeff = this.zoomKoeff();

    return snippets.map(({ id, width, height, left, top }) => ({
      id,
      styles: {
        width: this.documentViewerService.getZoomedSize(width) + "px",
        height: this.documentViewerService.getZoomedSize(height) + "px",
        left: this.documentViewerService.getZoomedSize(left) + "px",
        top: this.documentViewerService.getZoomedSize(top) + "px",
      }
    }));
  });
}
