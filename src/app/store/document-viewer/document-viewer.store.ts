import { computed, inject, Injectable } from "@angular/core";
import { AnyToInt } from "@helpers/converters";
import { Clamp } from "@helpers/math";
import { signalStore, withComputed, withState } from "@ngrx/signals";
import { on, withReducer } from "@ngrx/signals/events";
import { DocumentStore } from "@store/document/document.store";
import { SetPositionAction, SetZoomAction } from "./document-viewer.actions";
import { DocumentViewerInitialState } from "./document-viewer.state";

@Injectable()
export class DocumentViewerStore extends signalStore(
  withState(DocumentViewerInitialState),

  withReducer(
    on(SetZoomAction, ({ payload: zoom }) => ({ zoom })),
    on(SetPositionAction, ({ payload: { x, y } }) => ({ positionX: x, positionY: y })),
  ),

  withComputed(store => ({
    zoomKoeff: computed(() => Math.pow(2, store.zoom() - 1))
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
