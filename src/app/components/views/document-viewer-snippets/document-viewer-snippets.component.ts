import { ChangeDetectionStrategy, Component, computed, inject, model, signal, WritableSignal } from "@angular/core";
import { Clamp } from "@helpers/math";
import { DraggingEvent, DragStartEvent } from "@models/app";
import { DocumentSnippetForHtml, DocumentSnippetPosition, DocumentSnippetSizes } from "@models/document";
import { Dispatcher } from "@ngrx/signals/events";
import { DocumentViewerService } from "@services/document-viewer.service";
import { SetSnippetRectAction } from "@store/document-snippets/document-snippet.actions";
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
  private readonly documentViewerService = inject(DocumentViewerService);
  private readonly documentViewerStore = inject(DocumentViewerStore);
  private readonly dispatcher = inject(Dispatcher);

  readonly isSnippetHelperDragging = model(false);

  private startX = 0;
  private startY = 0;

  private readonly snippetsDraggingSignals: Record<number, WritableSignal<boolean>> = {};

  readonly editingIdSignal = this.documentSnippetsStore.editingId;

  private readonly currentDocumentSnippets = this.documentSnippetsStore.currentDocumentSnippets;
  private readonly imageOriginalWidth = this.documentViewerStore.imageOriginalWidth;
  private readonly imageOriginalHeight = this.documentViewerStore.imageOriginalHeight;

  readonly snippetsSignal = computed<DocumentSnippetForHtml[]>(() => this.currentDocumentSnippets()
    .map(snippet => {
      const dragging = this.snippetsDraggingSignals[snippet.id] || signal(false);

      this.snippetsDraggingSignals[snippet.id] = dragging;

      return {
        ...snippet,
        dragging,
        styles: {
          width: this.documentViewerService.getZoomedSize(snippet.width) + "px",
          height: this.documentViewerService.getZoomedSize(snippet.height) + "px",
          left: this.documentViewerService.getZoomedSize(snippet.left) + "px",
          top: this.documentViewerService.getZoomedSize(snippet.top) + "px",
        }
      };
    })
  );

  snippetsTracking({ id }: DocumentSnippetForHtml) {
    return [id].join("-");
  }

  onStart({ left, top }: DocumentSnippetPosition, { startX, startY }: DragStartEvent) {
    this.startX = this.documentViewerService.getUnShiftedUnZoomedX(startX) - left;
    this.startY = this.documentViewerService.getUnShiftedUnZoomedY(startY) - top;
  }

  onDragging({ id, width, height }: DocumentSnippetSizes, { clientX, clientY }: DraggingEvent) {
    const top = this.documentViewerService.getUnShiftedUnZoomedY(clientY) - this.startY;
    const left = this.documentViewerService.getUnShiftedUnZoomedX(clientX) - this.startX;

    this.dispatcher.dispatch(SetSnippetRectAction({
      id,
      top: Clamp(top, 0, this.imageOriginalHeight() - height),
      left: Clamp(left, 0, this.imageOriginalWidth() - width),
    }));
  }
}
