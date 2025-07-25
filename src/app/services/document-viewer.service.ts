import { inject, Injectable } from "@angular/core";
import { DocumentViewerStore } from "@store/document-viewer/document-viewer.store";

@Injectable()
export class DocumentViewerService {
  private readonly documentViewerStore = inject(DocumentViewerStore);

  private readonly imageByElmScaled = this.documentViewerStore.imageByElmScaled;

  getUnZoomedSize(size: number): number {
    return size / this.imageByElmScaled();
  }

  getZoomedSize(size: number): number {
    return size * this.imageByElmScaled();
  }
}
