import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, model, signal, viewChild } from "@angular/core";
import { Clamp } from "@helpers/math";
import { DraggingEvent } from "@models/app";
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

  private readonly helperRect = this.documentSnippetsStore.helperRect;
  private readonly imageOriginalWidth = this.documentViewerStore.imageOriginalWidth;
  private readonly imageOriginalHeight = this.documentViewerStore.imageOriginalHeight;

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

  onDragging({ clientX, clientY }: DraggingEvent) {
    const helperRect = this.helperRect();

    if (helperRect) {
      const width = this.documentViewerService.getUnShiftedUnZoomedX(clientX) - helperRect.left;
      const height = this.documentViewerService.getUnShiftedUnZoomedY(clientY) - helperRect.top;
      const minWidth = -helperRect.left;
      const minHeight = -helperRect.top;
      const maxWidth = this.imageOriginalWidth() - helperRect.left;
      const maxHeight = this.imageOriginalHeight() - helperRect.top;
      const data = {
        width: Clamp(width, minWidth, maxWidth),
        height: Clamp(height, minHeight, maxHeight),
      };

      this.dispatcher.dispatch(SetCreatingSnippetSizeAction(data));
    }
  }

  onDragEnd() {
    const helperRect = this.helperRect();

    if (helperRect && helperRect.width !== 0 && helperRect.height !== 0) {
      this.dispatcher.dispatch(CreateSnippetAction());
    }
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
