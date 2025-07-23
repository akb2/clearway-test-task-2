import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, inject, input, OnDestroy, signal, } from "@angular/core";
import { Router } from "@angular/router";
import { Clamp } from "@helpers/math";
import { Direction, DraggingEvent, DragStartEvent } from "@models/app";
import { DocumentItem } from "@models/document";
import { DocumentViewUrl } from "@models/route";
import { ResizeEvent } from "@models/ui";
import { Dispatcher } from "@ngrx/signals/events";
import { CreateSnippetAction } from "@store/document-snippets/document-snippet.actions";
import { SetPositionAction } from "@store/document-viewer/document-viewer.actions";
import { DocumentViewerStore } from "@store/document-viewer/document-viewer.store";
import { defer, filter, forkJoin, from, Subject, takeUntil, timer } from "rxjs";

@Component({
  selector: "app-document-viewer",
  templateUrl: "./document-viewer.component.html",
  styleUrls: ["./document-viewer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DocumentViewerComponent implements OnDestroy {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly dispatcher = inject(Dispatcher);
  private readonly documentViewerStore = inject(DocumentViewerStore);

  readonly documents = input<DocumentItem[]>();
  readonly document = input<DocumentItem>();

  private readonly containerWidth = signal(0);
  private readonly containerHeight = signal(0);

  private readonly imageOriginalWidth = signal(0);
  private readonly imageOriginalHeight = signal(0);

  readonly zoom = this.documentViewerStore.zoom;
  readonly isImageDragging = signal(false);
  readonly isPageScrolling = signal(false);
  readonly isCreatingSnippet = signal(false);

  private readonly isPageLoading = signal(false);

  readonly nextDocumentIndex = this.documentViewerStore.nextPage;
  readonly prevDocumentIndex = this.documentViewerStore.prevPage;

  private readonly imageShiftX = this.documentViewerStore.positionX;
  private readonly imageShiftY = this.documentViewerStore.positionY;

  private isWaitingForCreateSnippet = false;

  private readonly pageChangindDelayMs = 300;
  private readonly createSnippetTimeout = 750;

  readonly pageLoading = computed(() => this.isPageLoading() || this.isPageScrolling());

  private readonly zoomKoeff = computed(() => Math.pow(2, this.zoom() - 1));
  private readonly aspectRatio = computed(() => this.imageOriginalWidth() / this.imageOriginalHeight());
  private readonly isVertical = computed(() => this.containerWidth() / this.containerHeight() > this.aspectRatio());
  private readonly imageScaledWidth = computed(() => this.imageAspectedWidth() * this.zoomKoeff());
  private readonly imageScaledHeight = computed(() => this.imageAspectedHeight() * this.zoomKoeff());
  private readonly imageInitialPositionX = computed(() => (this.containerWidth() - this.imageScaledWidth()) / 2);
  private readonly imageInitialPositionY = computed(() => (this.containerHeight() - this.imageScaledHeight()) / 2);
  private readonly minImageShiftX = computed(() => this.imageInitialPositionX() - this.imageShiftDistanceX());
  private readonly maxImageShiftX = computed(() => this.imageInitialPositionX() + this.imageShiftDistanceX());
  private readonly minImageShiftY = computed(() => this.imageInitialPositionY() - this.imageShiftDistanceY());
  private readonly maxImageShiftY = computed(() => this.imageInitialPositionY() + this.imageShiftDistanceY());

  private readonly imageAspectedWidth = computed(() => this.isVertical()
    ? this.containerHeight() * this.aspectRatio()
    : this.containerWidth()
  );

  private readonly imageAspectedHeight = computed(() => this.isVertical()
    ? this.containerHeight()
    : this.containerWidth() / this.aspectRatio()
  );

  private readonly imageShiftDistanceX = computed(() => this.imageScaledWidth() > this.containerWidth()
    ? -this.imageInitialPositionX()
    : 0
  );

  private readonly imageShiftDistanceY = computed(() => this.imageScaledHeight() > this.containerHeight()
    ? -this.imageInitialPositionY()
    : 0
  );

  private readonly destroyed$ = new Subject<void>();

  readonly styles = computed<Record<string, string>>(() => {
    if (this.containerWidth() > 0 && this.containerHeight() > 0 && this.imageOriginalWidth() > 0 && this.imageAspectedHeight() > 0) {
      const zoomKoeff = this.zoomKoeff();
      const left = Clamp(
        this.imageShiftX() * zoomKoeff + this.imageInitialPositionX(),
        this.minImageShiftX(),
        this.maxImageShiftX()
      );
      const top = Clamp(
        this.imageShiftY() * zoomKoeff + this.imageInitialPositionY(),
        this.minImageShiftY(),
        this.maxImageShiftY()
      );

      return {
        width: this.imageScaledWidth() + "px",
        height: this.imageScaledHeight() + "px",
        left: left + "px",
        top: top + "px"
      };
    }

    return {} as Record<string, string>;
  });

  private setImageShifts(x: number, y: number) {
    const zoomKoeff = this.zoomKoeff();
    const maxX = this.imageShiftDistanceX();
    const maxY = this.imageShiftDistanceY();

    this.dispatcher.dispatch(SetPositionAction({
      x: Clamp(x, -maxX, maxX) / zoomKoeff,
      y: Clamp(y, -maxY, maxY) / zoomKoeff
    }));
  }

  constructor() {
    this.onZoomChangeListener();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onResize({ width, height }: ResizeEvent) {
    this.containerWidth.set(width);
    this.containerHeight.set(height);

    this.changeDetectorRef.detectChanges();
  }

  onImageLoad(event: Event) {
    const imgElement = event.target as HTMLImageElement;

    this.imageOriginalWidth.set(imgElement.naturalWidth);
    this.imageOriginalHeight.set(imgElement.naturalHeight);
  }

  onImageDragStart(event: DragStartEvent) {
    this.isWaitingForCreateSnippet = true;

    timer(this.createSnippetTimeout)
      .pipe(
        filter(() => this.isWaitingForCreateSnippet && this.isImageDragging()),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        this.isWaitingForCreateSnippet = false;

        this.dispatcher.dispatch(CreateSnippetAction(event));
      });
  }

  onImageDrag(event: DraggingEvent) {
    const zoomKoeff = this.zoomKoeff();

    this.setImageShifts(
      this.imageShiftX() * zoomKoeff + event.deltaX,
      this.imageShiftY() * zoomKoeff + event.deltaY
    );
    this.isWaitingForCreateSnippet = false;
  }

  onImageDragEnd() {
    this.isWaitingForCreateSnippet = false;
  }

  onScrollStart(direction: Direction) {
    if (!this.isPageLoading()) {
      const newIndex = direction > 0
        ? this.nextDocumentIndex()
        : this.prevDocumentIndex();
      const nextDocument = this.documents()?.[newIndex - 1];

      if (nextDocument) {
        this.isPageLoading.set(true);

        forkJoin([
          from(defer(() => this.router.navigateByUrl(DocumentViewUrl + nextDocument.id))),
          timer(this.pageChangindDelayMs)
        ])
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => this.isPageLoading.set(false));
      }
    }
  }

  private onZoomChangeListener() {
    let prevZoomKoeff = this.zoomKoeff();

    effect(() => {
      const zoomKoeff = this.zoomKoeff();

      if (zoomKoeff !== prevZoomKoeff) {
        const scaleRatio = prevZoomKoeff * zoomKoeff / prevZoomKoeff;

        this.setImageShifts(this.imageShiftX() * scaleRatio, this.imageShiftY() * scaleRatio);

        prevZoomKoeff = zoomKoeff;
      }
    });
  }
}
