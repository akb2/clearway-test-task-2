import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IsMacOs } from "@helpers/app";
import { Clamp } from '@helpers/math';
import { Direction } from "@models/math";
import { Dispatcher } from "@ngrx/signals/events";
import { SetZoomAction } from "@store/document-viewer/document-viewer.actions";
import { DocumentViewerStore } from "@store/document-viewer/document-viewer.store";
import { filter, fromEvent, tap } from "rxjs";

@Component({
  selector: "app-document-viewer-actions",
  templateUrl: "./document-viewer-actions.component.html",
  styleUrl: "./document-viewer-actions.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DocumentViewerActionsComponent implements OnInit {
  private readonly dispatcher = inject(Dispatcher);
  private readonly documentViewerStore = inject(DocumentViewerStore);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentPageIndex = this.documentViewerStore.currentPage;
  readonly prevPageAvailable = this.documentViewerStore.prevPageAvailable;
  readonly nextPageAvailable = this.documentViewerStore.nextPageAvailable;
  readonly pagesCount = this.documentViewerStore.pagesCount;

  readonly changePage = output<Direction>();

  readonly zoom = this.documentViewerStore.zoom;

  readonly zoomMin = 1;
  readonly zoomMax = 4;
  private readonly zoomStep = 0.2;

  readonly zoomPercentValue = computed(() => Math.round(this.zoom() / this.zoomMin * 100));

  ngOnInit(): void {
    this.keyboardZoomListener();
  }

  onZoomIn() {
    this.setZoom(this.zoom() + this.zoomStep);
  }

  onZoomOut() {
    this.setZoom(this.zoom() - this.zoomStep);
  }

  setZoom(zoom: number) {
    this.dispatcher.dispatch(SetZoomAction(Clamp(zoom, this.zoomMin, this.zoomMax)));
  }

  private keyboardZoomListener() {
    const zoomInKeys = ["Equal", "NumpadAdd"];
    const zoomOutKeys = ["Minus", "NumpadSubtract"];
    const zoomClear = ["Digit0", "Numpad0"];
    const nextPage = ["ArrowDown", "ArrowRight"];
    const prevPage = ["ArrowUp", "ArrowLeft"];
    const ctrlKeys = [...zoomInKeys, ...zoomOutKeys, ...zoomClear, ...prevPage, ...nextPage];
    const simpleKeys: string[] = [];
    const isMacOs = IsMacOs();

    fromEvent<KeyboardEvent>(document, "keydown")
      .pipe(
        filter(({ ctrlKey, metaKey, code }) => (
          (ctrlKeys.includes(code) && isMacOs ? metaKey : ctrlKey)
          || simpleKeys.includes(code)
        )),
        tap(event => event.preventDefault()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ code }) => {
        if (zoomInKeys.includes(code)) {
          this.onZoomIn();
        } else if (zoomOutKeys.includes(code)) {
          this.onZoomOut();
        } else if (zoomClear.includes(code)) {
          this.setZoom(1);
        } else if (prevPage.includes(code)) {
          if (this.prevPageAvailable()) {
            this.changePage.emit(-1);
          }
        } else if (nextPage.includes(code)) {
          if (this.nextPageAvailable()) {
            this.changePage.emit(1);
          }
        }
      });
  }
}
