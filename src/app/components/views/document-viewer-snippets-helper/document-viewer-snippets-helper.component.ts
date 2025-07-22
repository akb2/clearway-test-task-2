import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, model, viewChild } from "@angular/core";
import { DraggingEvent, DragStartEvent } from "@models/app";
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

  readonly helperElm = viewChild("helperElm", { read: ElementRef<HTMLElement> });

  constructor() {
    this.createSnippetActionListener();
  }

  onDragStart(event: DragStartEvent) {
  }

  onDragging(event: DraggingEvent) {
  }

  onDragEnd() { }

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
