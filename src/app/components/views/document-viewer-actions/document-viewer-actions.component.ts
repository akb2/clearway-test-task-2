import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, OnInit, output } from "@angular/core";
import { IsMacOs } from "@helpers/app";
import { Direction } from "@models/app";
import { Dispatcher } from "@ngrx/signals/events";
import { SetZoomAction } from "@store/document-viewer/document-viewer.actions";
import { DocumentViewerStore } from "@store/document-viewer/document-viewer.store";
import { filter, fromEvent, Subject, takeUntil, tap } from "rxjs";
import { Clamp } from '../../../helpers/math';

@Component({
  selector: "app-document-viewer-actions",
  templateUrl: "./document-viewer-actions.component.html",
  styleUrl: "./document-viewer-actions.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DocumentViewerActionsComponent implements OnInit, OnDestroy {
  private readonly dispatcher = inject(Dispatcher);
  private readonly documentViewerStore = inject(DocumentViewerStore);


  readonly currentPageIndex = input(-1);
  readonly prevPageIndex = input(-1);
  readonly nextPageIndex = input(-1);
  readonly pagesCount = input(0);

  readonly changePage = output<Direction>();

  readonly zoom = this.documentViewerStore.zoom;

  readonly zoomMin = 1;
  readonly zoomMax = 4;
  private readonly zoomStep = 0.2;

  readonly zoomPercentValue = computed(() => Math.round(this.zoom() / this.zoomMin * 100));

  private readonly destroyed$ = new Subject<void>();

  ngOnInit(): void {
    this.keyboardZoomListener();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
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
    const ctrlKeys = [...zoomInKeys, ...zoomOutKeys, ...zoomClear];
    const simpleKeys = [...prevPage, ...nextPage];
    const isMacOs = IsMacOs();

    fromEvent<KeyboardEvent>(document, "keydown")
      .pipe(
        filter(({ ctrlKey, metaKey, code }) => (
          (ctrlKeys.includes(code) && isMacOs ? metaKey : ctrlKey)
          || simpleKeys.includes(code)
        )),
        tap(event => event.preventDefault()),
        takeUntil(this.destroyed$)
      )
      .subscribe(({ code }) => {
        if (zoomInKeys.includes(code)) {
          this.onZoomIn();
        } else if (zoomOutKeys.includes(code)) {
          this.onZoomOut();
        } else if (zoomClear.includes(code)) {
          this.setZoom(1);
        } else if (prevPage.includes(code)) {
          this.changePage.emit(-1);
        } else if (nextPage.includes(code)) {
          this.changePage.emit(1);
        }
      });
  }
}
