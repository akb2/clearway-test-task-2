import { ChangeDetectionStrategy, Component, model, OnDestroy, OnInit } from "@angular/core";
import { IsMacOs } from "@helpers/app";
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
    const isMacOs = IsMacOs();

    fromEvent<KeyboardEvent>(document, "keydown")
      .pipe(
        filter(({ ctrlKey, metaKey, code }) => (
          (zoomInKeys.includes(code) || zoomOutKeys.includes(code))
          && ((ctrlKey && !isMacOs) || (metaKey && isMacOs))
        )),
        tap(event => event.preventDefault()),
        takeUntil(this.destroyed$)
      )
      .subscribe(({ code }) => zoomInKeys.includes(code)
        ? this.onZoomIn()
        : this.onZoomOut()
      );
  }
}
