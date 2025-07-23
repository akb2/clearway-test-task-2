import { computed, inject, Injectable } from "@angular/core";
import { AnyToInt } from "@helpers/converters";
import { Clamp } from "@helpers/math";
import { signalStore, withComputed, withState } from "@ngrx/signals";
import { on, withReducer } from "@ngrx/signals/events";
import { DocumentStore } from "@store/document/document.store";
import { SetContainerRectAction, SetImagePositionAction, SetImageSizeAction, SetZoomAction } from "./document-viewer.actions";
import { DocumentViewerInitialState } from "./document-viewer.state";

@Injectable()
export class DocumentViewerStore extends signalStore(
  withState(DocumentViewerInitialState),

  withReducer(
    on(SetZoomAction, ({ payload: zoom }) => ({ zoom })),
    on(SetContainerRectAction, ({ payload: containerRect }) => ({ containerRect })),
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

  withComputed(store => ({
    zoomKoeff: computed(() => Math.pow(2, store.zoom() - 1)),
    containerWidth: computed(() => store.containerRect().width),
    containerHeight: computed(() => store.containerRect().height),
    imagePositionLeft: computed(() => store.imageRect().left),
    imagePositionTop: computed(() => store.imageRect().top),
    imageOriginalWidth: computed(() => store.imageRect().width),
    imageOriginalHeight: computed(() => store.imageRect().height),
  })),
) {
  private readonly documentStore = inject(DocumentStore);

  readonly pagesCount = computed(() => AnyToInt(this.documentStore.documents()?.length));
  readonly prevPage = computed(() => Clamp(this.currentPage() - 1, 1, this.pagesCount()));
  readonly nextPage = computed(() => Clamp(this.currentPage() + 1, 1, this.pagesCount()));
  readonly prevPageAvailable = computed(() => this.currentPage() - 1 > 0);
  readonly nextPageAvailable = computed(() => this.currentPage() + 1 <= this.pagesCount());

  readonly currentPage = computed(() =>
    AnyToInt(
      this.documentStore.documents()?.findIndex(({ id }) => id === this.documentStore.viewingDocumentId()),
      -1
    ) + 1
  );
}
