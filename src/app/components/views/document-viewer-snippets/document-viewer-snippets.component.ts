import { ChangeDetectionStrategy, Component, computed, inject, model } from "@angular/core";
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

  readonly isSnippetHelperDragging = model(false);

  private readonly helperRect = this.documentSnippetsStore.helperRect;
  private readonly currentDocumentSnippets = this.documentSnippetsStore.currentDocumentSnippets;
  private readonly zoomKoeff = this.documentViewerStore.zoomKoeff;

  readonly snippetsSignal = computed(() => {
    const snippets = this.currentDocumentSnippets();
    const zoomKoeff = this.zoomKoeff();

    return snippets.map(({ id, width, height, left, top }) => ({
      id,
      styles: {
        width: (width * zoomKoeff) + "px",
        height: (height * zoomKoeff) + "px",
        left: (left * zoomKoeff) + "px",
        top: (top * zoomKoeff) + "px",
      }
    }));
  });
}
