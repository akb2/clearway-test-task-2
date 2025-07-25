import { computed, inject, Injectable } from "@angular/core";
import { AnyToInt } from "@helpers/converters";
import { Clamp } from "@helpers/math";
import { signalStore, withComputed, withState } from "@ngrx/signals";
import { on, withReducer } from "@ngrx/signals/events";
import { debugActions } from "@store/debug.actions";
import { DocumentStore } from "@store/document/document.store";
import { DocumentViewerActions, SetContainerRectAction, SetImageElmRectAction, SetImagePositionAction, SetImageSizeAction, SetZoomAction } from "./document-viewer.actions";
import { DocumentViewerInitialState } from "./document-viewer.state";

@Injectable()
export class DocumentViewerStore extends signalStore(
  debugActions(DocumentViewerActions),

  withState(DocumentViewerInitialState),

  withReducer(
    on(SetZoomAction, ({ payload: zoom }) => ({ zoom })),
    on(SetContainerRectAction, ({ payload: containerRect }) => ({ containerRect })),
    on(SetImageElmRectAction, ({ payload: imageElmRect }) => ({ imageElmRect })),
    on(SetImagePositionAction, ({ payload: { left, top } }, { imageRect }) => ({
      imageRect: {
        width: AnyToInt(imageRect?.width),
        height: AnyToInt(imageRect?.height),
        left,
        top,
      }
    })),
    on(SetImageSizeAction, ({ payload: { width, height } }, { imageRect }) => ({
      imageRect: {
        width,
        height,
        left: AnyToInt(imageRect?.left),
        top: AnyToInt(imageRect?.top),
      }
    })),
  ),

  withComputed((store, documentStore = inject(DocumentStore)) => ({
    pagesCount: computed(() => AnyToInt(documentStore.documents()?.length)),
    currentPage: computed(() => AnyToInt(
      documentStore.documents()?.findIndex(({ id }) => id === documentStore.viewingDocumentId()),
      -1
    ) + 1),
    zoomKoeff: computed(() => Math.pow(2, store.zoom() - 1)),
    containerWidth: computed(() => store.containerRect().width),
    containerHeight: computed(() => store.containerRect().height),
    imagePositionLeft: computed(() => store.imageRect().left),
    imagePositionTop: computed(() => store.imageRect().top),
    imageOriginalWidth: computed(() => store.imageRect().width),
    imageOriginalHeight: computed(() => store.imageRect().height),
  })),
) {

  readonly prevPage = computed(() => Clamp(this.currentPage() - 1, 1, this.pagesCount()));
  readonly nextPage = computed(() => Clamp(this.currentPage() + 1, 1, this.pagesCount()));
  readonly prevPageAvailable = computed(() => this.currentPage() - 1 > 0);
  readonly nextPageAvailable = computed(() => this.currentPage() + 1 <= this.pagesCount());
  readonly imageScaledWidth = computed(() => this.imageAspectedWidth() * this.zoomKoeff());
  readonly imageScaledHeight = computed(() => this.imageAspectedHeight() * this.zoomKoeff());
  readonly imageByElmScaled = computed(() => this.imageOriginalWidth() / this.imageElmRect().width);

  private readonly aspectRatio = computed(() => this.imageOriginalWidth() / this.imageOriginalHeight());
  private readonly isVertical = computed(() => this.containerWidth() / this.containerHeight() > this.aspectRatio());
  private readonly imageInitialPositionX = computed(() => (this.containerWidth() - this.imageScaledWidth()) / 2);
  private readonly imageInitialPositionY = computed(() => (this.containerHeight() - this.imageScaledHeight()) / 2);
  private readonly minImageShiftX = computed(() => this.imageInitialPositionX() - this.imageShiftDistanceX());
  private readonly maxImageShiftX = computed(() => this.imageInitialPositionX() + this.imageShiftDistanceX());
  private readonly minImageShiftY = computed(() => this.imageInitialPositionY() - this.imageShiftDistanceY());
  private readonly maxImageShiftY = computed(() => this.imageInitialPositionY() + this.imageShiftDistanceY());

  readonly imageShiftDistanceX = computed(() => this.imageScaledWidth() > this.containerWidth()
    ? -this.imageInitialPositionX()
    : 0
  );

  readonly imageShiftDistanceY = computed(() => this.imageScaledHeight() > this.containerHeight()
    ? -this.imageInitialPositionY()
    : 0
  );

  private readonly imageAspectedWidth = computed(() => this.isVertical()
    ? this.containerHeight() * this.aspectRatio()
    : this.containerWidth()
  );

  private readonly imageAspectedHeight = computed(() => this.isVertical()
    ? this.containerHeight()
    : this.containerWidth() / this.aspectRatio()
  );

  readonly imageLoaded = computed(() => (
    this.containerWidth() > 0
    && this.containerHeight() > 0
    && this.imageOriginalWidth() > 0
    && this.imageOriginalWidth() > 0
  ));

  readonly imageShiftTop = computed(() => Clamp(
    this.imagePositionTop() * this.zoomKoeff() + this.imageInitialPositionY(),
    this.minImageShiftY(),
    this.maxImageShiftY()
  ));

  readonly imageShiftLeft = computed(() => Clamp(
    this.imagePositionLeft() * this.zoomKoeff() + this.imageInitialPositionX(),
    this.minImageShiftX(),
    this.maxImageShiftX()
  ));
}
