import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Clamp } from "@helpers/math";
import { Direction } from "@models/app";
import { XYCoords } from "@models/math";
import { DocumentViewUrl } from "@models/route";
import { ResizeEvent } from "@models/ui";
import { Dispatcher } from "@ngrx/signals/events";
import { SetContainerRectAction, SetImagePositionAction } from "@store/document-viewer/document-viewer.actions";
import { DocumentViewerStore } from "@store/document-viewer/document-viewer.store";
import { DocumentStore } from "@store/document/document.store";
import { defer, forkJoin, from, Subject, takeUntil, timer } from "rxjs";

@Component({
  selector: "app-document-viewer",
  templateUrl: "./document-viewer.component.html",
  styleUrls: ["./document-viewer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DocumentViewerComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly dispatcher = inject(Dispatcher);
  private readonly documentStore = inject(DocumentStore);
  private readonly documentViewerStore = inject(DocumentViewerStore);

  readonly isPageScrolling = signal(false);

  private readonly isPageLoading = signal(false);

  readonly nextDocumentIndex = this.documentViewerStore.nextPage;
  readonly prevDocumentIndex = this.documentViewerStore.prevPage;

  private readonly documents = this.documentStore.documents;
  private readonly imagePositionLeft = this.documentViewerStore.imagePositionLeft;
  private readonly imagePositionTop = this.documentViewerStore.imagePositionTop;
  private readonly zoomKoeff = this.documentViewerStore.zoomKoeff;
  private readonly imageShiftDistanceX = this.documentViewerStore.imageShiftDistanceX;
  private readonly imageShiftDistanceY = this.documentViewerStore.imageShiftDistanceY;

  private readonly pageChangindDelayMs = 300;

  readonly pageLoading = computed(() => this.isPageLoading() || this.isPageScrolling());

  private readonly destroyed$ = new Subject<void>();

  setImageShifts({ x, y }: XYCoords) {
    const zoomKoeff = this.zoomKoeff();
    const maxX = this.imageShiftDistanceX();
    const maxY = this.imageShiftDistanceY();

    this.dispatcher.dispatch(SetImagePositionAction({
      left: Clamp(x, -maxX, maxX) / zoomKoeff,
      top: Clamp(y, -maxY, maxY) / zoomKoeff
    }));
  }

  constructor() {
    this.onZoomChangeListener();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onResize(event: ResizeEvent) {
    this.dispatcher.dispatch(SetContainerRectAction(event));
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

        this.setImageShifts({
          x: this.imagePositionLeft() * scaleRatio,
          y: this.imagePositionTop() * scaleRatio
        });

        prevZoomKoeff = zoomKoeff;
      }
    });
  }
}
