import { inject, Injectable } from "@angular/core";
import { DocumentViewerStore } from "@store/document-viewer/document-viewer.store";

@Injectable()
export class DocumentViewerService {
  private readonly documentViewerStore = inject(DocumentViewerStore);

  private readonly imageByElmScaled = this.documentViewerStore.imageByElmScaled;
  private readonly containerRect = this.documentViewerStore.containerRect;
  private readonly imageShiftLeft = this.documentViewerStore.imageShiftLeft;
  private readonly imageShiftTop = this.documentViewerStore.imageShiftTop;

  private getUnShiftedX(x: number) {
    return x - this.containerRect().left - this.imageShiftLeft();
  }

  private getUnShiftedY(y: number) {
    return y - this.containerRect().top - this.imageShiftTop();
  }

  getUnZoomedSize(size: number): number {
    return size / this.imageByElmScaled();
  }

  getZoomedSize(size: number): number {
    return size * this.imageByElmScaled();
  }

  getUnShiftedUnZoomedX(x: number) {
    return this.getUnZoomedSize(this.getUnShiftedX(x));
  }

  getUnShiftedUnZoomedY(y: number) {
    return this.getUnZoomedSize(this.getUnShiftedY(y));
  }
}
