import { ChangeDetectionStrategy, Component, model } from "@angular/core";
import { DocumentEditTool } from "@models/document";
import { Clamp } from '../../../helpers/math';

@Component({
  selector: "app-document-viewer-actions",
  templateUrl: "./document-viewer-actions.component.html",
  styleUrl: "./document-viewer-actions.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DocumentViewerActionsComponent {
  readonly zoom = model<number>(1);
  readonly tool = model<DocumentEditTool>(DocumentEditTool.view);

  readonly zoomMin = 1;
  readonly zoomMax = 4.2;
  private readonly zoomStep = 0.2;

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
}
