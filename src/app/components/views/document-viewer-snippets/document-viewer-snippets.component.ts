import { ChangeDetectionStrategy, Component, computed, inject, model } from "@angular/core";
import { DraggingEvent, DragStartEvent } from "@models/app";
import { DocumentSnippetPosition, DocumentSnippetWithStyles } from "@models/document";
import { Dispatcher } from "@ngrx/signals/events";
import { DocumentViewerService } from "@services/document-viewer.service";
import { SetSnippetPositionAction } from "@store/document-snippets/document-snippet.actions";
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
  private readonly dispatcher = inject(Dispatcher);

  readonly isSnippetHelperDragging = model(false);

  private startX = 0;
  private startY = 0;

  private readonly currentDocumentSnippets = this.documentSnippetsStore.currentDocumentSnippets;

  readonly snippetsSignal = computed<DocumentSnippetWithStyles[]>(() => this.currentDocumentSnippets()
    .map(({ id, top, left, width, height }) => ({
      id,
      top,
      left,
      width,
      height,
      styles: {
        width: this.documentViewerService.getZoomedSize(width) + "px",
        height: this.documentViewerService.getZoomedSize(height) + "px",
        left: this.documentViewerService.getZoomedSize(left) + "px",
        top: this.documentViewerService.getZoomedSize(top) + "px",
      }
    }))
  );

  snippetsTracking({ id }: DocumentSnippetWithStyles) {
    return [id].join("-");
  }

  onStart({ left, top }: DocumentSnippetPosition, { startX, startY }: DragStartEvent) {
    this.startX = this.documentViewerService.getUnShiftedUnZoomedX(startX) - left;
    this.startY = this.documentViewerService.getUnShiftedUnZoomedY(startY) - top;
  }

  onDragging({ id }: DocumentSnippetPosition, { clientX, clientY }: DraggingEvent) {
    this.dispatcher.dispatch(SetSnippetPositionAction({
      id,
      top: this.documentViewerService.getUnShiftedUnZoomedY(clientY) - this.startY,
      left: this.documentViewerService.getUnShiftedUnZoomedX(clientX) - this.startX,
    }));
  }
}
