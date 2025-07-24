import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, output, signal } from "@angular/core";
import { DraggingEvent, DragStartEvent } from "@models/app";
import { XYCoords } from "@models/math";
import { Dispatcher } from "@ngrx/signals/events";
import { CreateSnippetAction } from "@store/document-snippets/document-snippet.actions";
import { SetImageSizeAction } from "@store/document-viewer/document-viewer.actions";
import { DocumentViewerStore } from "@store/document-viewer/document-viewer.store";
import { DocumentStore } from "@store/document/document.store";
import { filter, Subject, takeUntil, timer } from "rxjs";

@Component({
  selector: "app-document-viewer-image",
  templateUrl: "./document-viewer-image.component.html",
  styleUrl: "./document-viewer-image.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DocumentViewerImageComponent implements OnDestroy {
  private readonly dispatcher = inject(Dispatcher);
  private readonly documentStore = inject(DocumentStore);
  private readonly documentViewerStore = inject(DocumentViewerStore);

  readonly pageLoading = input(false);

  readonly changePosition = output<XYCoords>();

  readonly isCreatingSnippet = signal(false);
  readonly isImageDragging = signal(false);

  readonly document = this.documentStore.viewingDocument;

  private readonly zoomKoeff = this.documentViewerStore.zoomKoeff;
  private readonly containerRect = this.documentViewerStore.containerRect;
  private readonly imagePositionTop = this.documentViewerStore.imagePositionTop;
  private readonly imagePositionLeft = this.documentViewerStore.imagePositionLeft;
  private readonly imageShiftLeft = this.documentViewerStore.imageShiftLeft;
  private readonly imageShiftTop = this.documentViewerStore.imageShiftTop;
  private readonly imageLoaded = this.documentViewerStore.imageLoaded;
  private readonly imageScaledWidth = this.documentViewerStore.imageScaledWidth;
  private readonly imageScaledHeight = this.documentViewerStore.imageScaledHeight;

  private readonly createSnippetTimeout = 750;

  private isWaitingForCreateSnippet = false;

  private readonly destroyed$ = new Subject<void>();

  readonly styles = computed<Record<string, string>>(() => {
    if (this.imageLoaded()) {
      return {
        width: this.imageScaledWidth() + "px",
        height: this.imageScaledHeight() + "px",
        left: this.imageShiftLeft() + "px",
        top: this.imageShiftTop() + "px"
      };
    }

    return {} as Record<string, string>;
  });

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onLoad(event: Event) {
    const { naturalWidth: width, naturalHeight: height } = event.target as HTMLImageElement;

    this.dispatcher.dispatch(SetImageSizeAction({ width, height }));
  }

  onDragStart(event: DragStartEvent) {
    this.isWaitingForCreateSnippet = true;

    timer(this.createSnippetTimeout)
      .pipe(
        filter(() => this.isWaitingForCreateSnippet && this.isImageDragging()),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        const zoomKoeff = this.zoomKoeff();
        const containerRect = this.containerRect();
        const helperRect = {
          left: (event.startX - containerRect.left - this.imageShiftLeft()) / zoomKoeff,
          top: (event.startY - containerRect.top - this.imageShiftTop()) / zoomKoeff,
        };

        this.isWaitingForCreateSnippet = false;

        this.dispatcher.dispatch(CreateSnippetAction(helperRect));
      });
  }

  onDrag(event: DraggingEvent) {
    const zoomKoeff = this.zoomKoeff();

    this.changePosition.emit({
      x: this.imagePositionLeft() * zoomKoeff + event.deltaX,
      y: this.imagePositionTop() * zoomKoeff + event.deltaY,
    });
    this.isWaitingForCreateSnippet = false;
  }

  onDragEnd() {
    this.isWaitingForCreateSnippet = false;
  }
}
