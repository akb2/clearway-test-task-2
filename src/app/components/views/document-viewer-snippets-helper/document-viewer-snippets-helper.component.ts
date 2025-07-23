import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, model, signal, viewChild } from "@angular/core";
import { DraggingEvent, DragStartEvent } from "@models/app";
import { ResizeEvent } from "@models/ui";
import { Dispatcher } from "@ngrx/signals/events";
import { ClearCreateSnippetEventAction } from "@store/document-snippets/document-snippet.actions";
import { DocumentSnippetsStore } from "@store/document-snippets/document-snippet.store";
import { DocumentViewerStore } from "@store/document-viewer/document-viewer.store";

@Component({
  selector: "app-document-viewer-snippets-helper",
  templateUrl: "./document-viewer-snippets-helper.component.html",
  styleUrl: "./document-viewer-snippets-helper.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentViewerSnippetsHelperComponent {
  private readonly documentSnippetsStore = inject(DocumentSnippetsStore);
  private readonly documentViewerStore = inject(DocumentViewerStore);
  private readonly dispatcher = inject(Dispatcher);

  readonly isDragging = model(false);

  private readonly positionX = signal(0);
  private readonly positionY = signal(0);
  readonly hostRect = signal<ResizeEvent>({ width: 0, height: 0, left: 0, top: 0 });

  private readonly zoom = this.documentViewerStore.zoom;
  private readonly imageShiftX = this.documentViewerStore.imagePositionLeft;
  private readonly imageShiftY = this.documentViewerStore.imagePositionTop;

  readonly helperElm = viewChild("helperElm", { read: ElementRef });

  private readonly zoomKoeff = computed(() => Math.pow(2, this.zoom() - 1));

  readonly styles = computed(() => {
    const zoomKoeff = this.zoomKoeff();
    const left = this.positionX() * zoomKoeff;
    const top = this.positionY() * zoomKoeff;

    return {
      left: left + "px",
      top: top + "px",
    };
  });

  constructor() {
    this.createSnippetActionListener();
  }

  onDragStart(event: DragStartEvent) {
    this.positionX.set(event.startX);
    this.positionY.set(event.startY);
  }

  onDragging(event: DraggingEvent) {
  }

  onDragEnd() { }

  onHostResized(event: ResizeEvent) {
    this.hostRect.set(event);
  }

  private createSnippetActionListener() {
    effect(() => {
      const event = this.documentSnippetsStore.helperRect();
      const elm = this.helperElm()?.nativeElement;

      if (event && elm) {
        elm.dispatchEvent(new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: event.left,
          clientY: event.top
        }));

        this.dispatcher.dispatch(ClearCreateSnippetEventAction());
      }
    });
  }
}
