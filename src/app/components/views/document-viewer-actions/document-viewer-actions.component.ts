import { ChangeDetectionStrategy, Component, model, OnDestroy, OnInit, output } from "@angular/core";
import { IsMacOs } from "@helpers/app";
import { Direction } from "@models/app";
import { DocumentEditTool } from "@models/document";
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
  readonly zoom = model<number>(1);
  readonly tool = model<DocumentEditTool>(DocumentEditTool.view);

  readonly changePage = output<Direction>();

  readonly zoomMin = 1;
  readonly zoomMax = 4.2;
  private readonly zoomStep = 0.2;

  private readonly destroyed$ = new Subject<void>();

  ngOnInit(): void {
    this.keyboardZoomListener();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onZoomIn() {
    const zoom = this.zoom();

    if (zoom + this.zoomStep <= this.zoomMax) {
      this.setZoom(zoom + this.zoomStep);
    }
  }

  onZoomOut() {
    const zoom = this.zoom();

    if (zoom - this.zoomStep >= this.zoomMin) {
      this.setZoom(zoom - this.zoomStep);
    }
  }

  private setZoom(zoom: number) {
    this.zoom.set(Clamp(zoom, this.zoomMin, this.zoomMax));
  }

  private keyboardZoomListener() {
    const zoomInKeys = ["Equal", "NumpadAdd"];
    const zoomOutKeys = ["Minus", "NumpadSubtract"];
    const zoomClear = ["Digit0", "Numpad0"];
    const nextPage = ["ArrowDown"];
    const prevPage = ["ArrowUp"];
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
