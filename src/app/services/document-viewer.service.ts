import { inject, Injectable } from "@angular/core";
import { DocumentViewerStore } from "@store/document-viewer/document-viewer.store";

@Injectable()
export class DocumentViewerService {
  private readonly documentViewerStore = inject(DocumentViewerStore);

  private readonly zoomKoeff = this.documentViewerStore.zoomKoeff;
  private readonly imageByElmScaled = this.documentViewerStore.imageByElmScaled;

  getUnZoomedSize(size: number): number {
    const zoomKoeff = this.zoomKoeff();
    const imageByElmScaled = this.imageByElmScaled();

    return (size / zoomKoeff) * imageByElmScaled;
  }

  getZoomedSize(size: number): number {
    const zoomKoeff = this.zoomKoeff();
    const imageByElmScaled = this.imageByElmScaled();

    return (size / imageByElmScaled) * zoomKoeff;
  }
}
