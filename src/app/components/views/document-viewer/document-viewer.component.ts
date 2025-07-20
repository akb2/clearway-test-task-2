import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, inject, input, OnDestroy, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AnyToInt } from "@helpers/converters";
import { Clamp } from "@helpers/math";
import { DraggingEvent } from "@models/app";
import { DocumentEditTool, DocumentItem } from "@models/document";
import { DocumentViewUrl } from "@models/route";
import { defer, delay, from, Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-document-viewer",
  templateUrl: "./document-viewer.component.html",
  styleUrls: ["./document-viewer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DocumentViewerComponent implements OnDestroy {
  readonly documents = input<DocumentItem[]>();
  readonly document = input<DocumentItem>();

  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  private readonly containerWidth = signal(0);
  private readonly containerHeight = signal(0);

  private readonly imageOriginalWidth = signal(0);
  private readonly imageOriginalHeight = signal(0);
  private readonly imageShiftX = signal(0);
  private readonly imageShiftY = signal(0);

  readonly zoom = signal<number>(1);
  readonly isDragging = signal(false);

  currentTool = DocumentEditTool.view;
  pageToggling = false;

  private readonly zoomKoeff = computed(() => Math.pow(2, this.zoom() - 1));
  private readonly aspectRatio = computed(() => this.imageOriginalWidth() / this.imageOriginalHeight());
  private readonly isVertical = computed(() => this.containerWidth() / this.containerHeight() > this.aspectRatio());
  private readonly imageScaledWidth = computed(() => this.imageAspectedWidth() * this.zoomKoeff());
  private readonly imageScaledHeight = computed(() => this.imageAspectedHeight() * this.zoomKoeff());
  private readonly imageInitialPositionX = computed(() => (this.containerWidth() - this.imageScaledWidth()) / 2);
  private readonly imageInitialPositionY = computed(() => (this.containerHeight() - this.imageScaledHeight()) / 2);

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

  private readonly minImageShiftX = computed(() => this.imageInitialPositionX() - this.imageShiftDistanceX());
  private readonly maxImageShiftX = computed(() => this.imageInitialPositionX() + this.imageShiftDistanceX());
  private readonly minImageShiftY = computed(() => this.imageInitialPositionY() - this.imageShiftDistanceY());
  private readonly maxImageShiftY = computed(() => this.imageInitialPositionY() + this.imageShiftDistanceY());

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

    this.imageShiftX.set(Clamp(x, -maxX, maxX) / zoomKoeff);
    this.imageShiftY.set(Clamp(y, -maxY, maxY) / zoomKoeff);
  }

  constructor() {
    this.onZoomChangeListener();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onResize(event: ResizeObserverEntry) {
    this.containerWidth.set(event.contentRect.width);
    this.containerHeight.set(event.contentRect.height);

    this.changeDetectorRef.detectChanges();
  }

  onImageLoad(event: Event) {
    const imgElement = event.target as HTMLImageElement;

    this.imageOriginalWidth.set(imgElement.naturalWidth);
    this.imageOriginalHeight.set(imgElement.naturalHeight);
  }

  onImageDrag(event: DraggingEvent) {
    const zoomKoeff = this.zoomKoeff();

    this.setImageShifts(
      this.imageShiftX() * zoomKoeff + event.deltaX,
      this.imageShiftY() * zoomKoeff + event.deltaY
    );
  }

  onScroll(event: WheelEvent) {
    if (!this.pageToggling) {
      const documents = this.documents();
      const document = this.document();
      const documentIndex = AnyToInt(documents?.findIndex(({ id }) => id === document?.id), -1);
      const nextIndex = documentIndex + (event.deltaY / Math.abs(event.deltaY));
      const nextDocument = documents && nextIndex >= 0 && nextIndex < documents.length
        ? documents[nextIndex]
        : undefined;

      if (nextDocument) {
        console.log('akb2', event);
        this.pageToggling = true;

        from(defer(() => this.router.navigateByUrl(DocumentViewUrl + nextDocument.id)))
          .pipe(
            delay(500),
            takeUntil(this.destroyed$)
          )
          .subscribe(() => {
            this.pageToggling = false;
            this.changeDetectorRef.markForCheck();
          });
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
