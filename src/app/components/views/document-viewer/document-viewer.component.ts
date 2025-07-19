import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, inject, input, signal } from "@angular/core";
import { Clamp } from "@helpers/math";
import { DraggingEvent } from "@models/app";
import { DocumentEditTool, DocumentItem } from "@models/document";

@Component({
  selector: "app-document-viewer",
  templateUrl: "./document-viewer.component.html",
  styleUrls: ["./document-viewer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DocumentViewerComponent {
  readonly document = input<DocumentItem>();

  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  private readonly containerWidth = signal(0);
  private readonly containerHeight = signal(0);

  private readonly imageOriginalWidth = signal(0);
  private readonly imageOriginalHeight = signal(0);
  private readonly imageShiftX = signal(0);
  private readonly imageShiftY = signal(0);

  readonly zoom = signal<number>(3);
  readonly isDragging = signal(false);

  currentTool = DocumentEditTool.view;

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

  readonly styles = computed<Record<string, string>>(() => {
    if (this.containerWidth() > 0 && this.containerHeight() > 0 && this.imageOriginalWidth() > 0 && this.imageOriginalHeight() > 0) {
      const zoomKoeff = this.zoomKoeff();
      const left = Clamp(this.imageShiftX() * zoomKoeff + this.imageInitialPositionX(), this.minImageShiftX(), this.maxImageShiftX());
      const top = Clamp(this.imageShiftY() * zoomKoeff + this.imageInitialPositionY(), this.minImageShiftY(), this.maxImageShiftY());

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
