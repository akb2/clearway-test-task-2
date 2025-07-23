import { Injectable } from "@angular/core";
import { signalStore, withState } from "@ngrx/signals";
import { on, withReducer } from "@ngrx/signals/events";
import { SetZoomAction } from "./document-viewer.actions";
import { DocumentViewerInitialState } from "./document-viewer.state";

@Injectable()
export class DocumentViewerStore extends signalStore(
  withState(DocumentViewerInitialState),

  withReducer(
    on(SetZoomAction, ({ payload: zoom }) => ({ zoom })),
  ),
) { }
