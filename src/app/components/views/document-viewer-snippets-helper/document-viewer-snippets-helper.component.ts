import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, model, signal, viewChild } from "@angular/core";
import { DraggingEvent, DragStartEvent } from "@models/app";
import { ResizeEvent } from "@models/ui";
import { Dispatcher } from "@ngrx/signals/events";
import { ClearCreateSnippetEventAction } from "@store/document-snippets/document-snippet.actions";
import { DocumentSnippetsStore } from "@store/document-snippets/document-snippet.store";

@Component({
  selector: "app-document-viewer-snippets-helper",
  templateUrl: "./document-viewer-snippets-helper.component.html",
  styleUrl: "./document-viewer-snippets-helper.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentViewerSnippetsHelperComponent {
  private readonly documentSnippetsStore = inject(DocumentSnippetsStore);
  private readonly dispatcher = inject(Dispatcher);

  readonly isDragging = model(false);

  private readonly positionX = signal(0);
  private readonly positionY = signal(0);
  readonly hostPositionX = signal(0);
  private readonly hostPositionY = signal(0);

  readonly helperElm = viewChild("helperElm", { read: ElementRef });

  readonly styles = computed(() => {
    const left = this.positionX() - this.hostPositionX();
    const top = this.positionY() - this.hostPositionY();

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

  onHostResized({ left, top }: ResizeEvent) {
    this.hostPositionX.set(left);
    this.hostPositionY.set(top);
  }

  private createSnippetActionListener() {
    effect(() => {
      const event = this.documentSnippetsStore.createEvent();
      const elm = this.helperElm()?.nativeElement;

      if (event && elm) {
        elm.dispatchEvent(new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: event.startX,
          clientY: event.startY
        }));

        this.dispatcher.dispatch(ClearCreateSnippetEventAction());
      }
    });
  }
}
