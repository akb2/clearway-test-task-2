import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, output, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DraggingEvent, DragStartEvent } from "@models/app";
import { XYCoords } from "@models/math";
import { Dispatcher } from "@ngrx/signals/events";
import { DocumentViewerService } from "@services/document-viewer.service";
import { SetCreatingSnippetPositionAction } from "@store/document-snippets/document-snippet.actions";
import { SetImageSizeAction } from "@store/document-viewer/document-viewer.actions";
import { DocumentViewerStore } from "@store/document-viewer/document-viewer.store";
import { DocumentStore } from "@store/document/document.store";
import { filter, timer } from "rxjs";

@Component({
  selector: "app-document-viewer-image",
  templateUrl: "./document-viewer-image.component.html",
  styleUrl: "./document-viewer-image.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DocumentViewerImageComponent {
  private readonly dispatcher = inject(Dispatcher);
  private readonly documentStore = inject(DocumentStore);
  private readonly documentViewerStore = inject(DocumentViewerStore);
  private readonly documentViewerService = inject(DocumentViewerService);
  private readonly destroyRef = inject(DestroyRef);

  readonly pageLoading = input(false);

  readonly changePosition = output<XYCoords>();

  readonly isCreatingSnippet = signal(false);
  readonly isImageDragging = signal(false);

  private readonly distanceToDragStart = 5;

  private readonly draggingDistanceX = signal(0);
  private readonly draggingDistanceY = signal(0);

  readonly document = this.documentStore.viewingDocument;

  private readonly zoomKoeff = this.documentViewerStore.zoomKoeff;
  private readonly imagePositionTop = this.documentViewerStore.imagePositionTop;
  private readonly imagePositionLeft = this.documentViewerStore.imagePositionLeft;
  private readonly imageShiftLeft = this.documentViewerStore.imageShiftLeft;
  private readonly imageShiftTop = this.documentViewerStore.imageShiftTop;
  private readonly imageLoaded = this.documentViewerStore.imageLoaded;
  private readonly imageScaledWidth = this.documentViewerStore.imageScaledWidth;
  private readonly imageScaledHeight = this.documentViewerStore.imageScaledHeight;

  private readonly createSnippetTimeout = 750;

  private isWaitingForCreateSnippet = false;

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

  onLoad(event: Event) {
    const { naturalWidth: width, naturalHeight: height } = event.target as HTMLImageElement;

    this.dispatcher.dispatch(SetImageSizeAction({ width, height }));
  }

  onDragStart({ startX, startY }: DragStartEvent) {
    this.isWaitingForCreateSnippet = true;

    timer(this.createSnippetTimeout)
      .pipe(
        filter(() => this.isWaitingForCreateSnippet && this.isImageDragging()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        const helperRect = {
          left: this.documentViewerService.getUnShiftedUnZoomedX(startX),
          top: this.documentViewerService.getUnShiftedUnZoomedY(startY),
        };

        this.isWaitingForCreateSnippet = false;
        this.clearDraggingStates();

        this.dispatcher.dispatch(SetCreatingSnippetPositionAction(helperRect));
      });
  }

  onDrag({ deltaX, deltaY }: DraggingEvent) {
    const draggingDistanceX = this.draggingDistanceX();
    const draggingDistanceY = this.draggingDistanceY();

    if (Math.abs(draggingDistanceX) > this.distanceToDragStart || Math.abs(draggingDistanceY) > this.distanceToDragStart) {
      const zoomKoeff = this.zoomKoeff();

      this.changePosition.emit({
        x: this.imagePositionLeft() * zoomKoeff + deltaX,
        y: this.imagePositionTop() * zoomKoeff + deltaY,
      });

      this.isWaitingForCreateSnippet = false;
    }

    else if (this.isWaitingForCreateSnippet) {
      this.draggingDistanceX.set(draggingDistanceX + deltaX);
      this.draggingDistanceY.set(draggingDistanceY + deltaX);
    }

    else {
      this.clearDraggingStates();
    }
  }

  onDragEnd() {
    this.clearDraggingStates();
    this.isWaitingForCreateSnippet = false;
  }

  private clearDraggingStates() {
    this.draggingDistanceX.set(0);
    this.draggingDistanceY.set(0);
  }
}
