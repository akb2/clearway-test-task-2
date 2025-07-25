import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, model, signal, viewChild } from "@angular/core";
import { DraggingEvent, DragStartEvent } from "@models/app";
import { ResizeEvent } from "@models/ui";
import { Dispatcher } from "@ngrx/signals/events";
import { DocumentViewerService } from "@services/document-viewer.service";
import { CreateSnippetAction, SetCreatingSnippetSizeAction } from "@store/document-snippets/document-snippet.actions";
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
  private readonly documentViewerService = inject(DocumentViewerService);
  private readonly documentSnippetsStore = inject(DocumentSnippetsStore);
  private readonly documentViewerStore = inject(DocumentViewerStore);
  private readonly dispatcher = inject(Dispatcher);

  readonly isDragging = model(false);

  readonly hostRect = signal<ResizeEvent>({ width: 0, height: 0, left: 0, top: 0 });

  private readonly zoom = this.documentViewerStore.zoom;
  private readonly containerRect = this.documentViewerStore.containerRect;
  private readonly imageShiftLeft = this.documentViewerStore.imageShiftLeft;
  private readonly imageShiftTop = this.documentViewerStore.imageShiftTop;
  private readonly helperRect = this.documentSnippetsStore.helperRect;
  private readonly zoomKoeff = this.documentViewerStore.zoomKoeff;
  private readonly imageByElmScaled = this.documentViewerStore.imageByElmScaled;

  readonly helperElm = viewChild("helperElm", { read: ElementRef });

  readonly styles = computed(() => {
    const helperRect = this.helperRect();

    if (helperRect) {
      const width = Math.abs(this.documentViewerService.getZoomedSize(helperRect.width));
      const height = Math.abs(this.documentViewerService.getZoomedSize(helperRect.height));
      const left = this.documentViewerService.getZoomedSize(helperRect.width > 0
        ? helperRect.left
        : helperRect.left + helperRect.width
      );
      const top = this.documentViewerService.getZoomedSize(helperRect.height > 0
        ? helperRect.top
        : helperRect.top + helperRect.height
      );

      return {
        width: width + "px",
        height: height + "px",
        left: left + "px",
        top: top + "px",
      };
    }

    return undefined;
  });

  constructor() {
    this.createSnippetActionListener();
  }

  onDragStart(event: DragStartEvent) {
  }

  onDragging({ clientX, clientY }: DraggingEvent) {
    const helperRect = this.helperRect();
    const containerRect = this.containerRect();
    const left = clientX - containerRect.left - this.imageShiftLeft();
    const top = clientY - containerRect.top - this.imageShiftTop();
    const data = {
      width: this.documentViewerService.getUnZoomedSize(left) - helperRect.left,
      height: this.documentViewerService.getUnZoomedSize(top) - helperRect.top,
    };

    this.dispatcher.dispatch(SetCreatingSnippetSizeAction(data));
  }

  onDragEnd() {
    this.dispatcher.dispatch(CreateSnippetAction());
  }

  onHostResized(event: ResizeEvent) {
    this.hostRect.set(event);
  }

  private createSnippetActionListener() {
    let lastLeft = -1;
    let lastTop = -1;

    effect(() => {
      const event = this.helperRect();
      const elm = this.helperElm()?.nativeElement;

      if (event && elm && (lastLeft !== event.left || lastTop !== event.top)) {
        lastLeft = event.left;
        lastTop = event.top;

        elm.dispatchEvent(new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: event.left,
          clientY: event.top
        }));
      }
    });
  }
}
