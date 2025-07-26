import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DirectionXNamesByDirection, DirectionYNamesByDirection } from "@helpers/math";
import { DraggingEvent, DragStartEvent } from "@models/app";
import { DocumentSnippetRect } from "@models/document";
import { Direction } from "@models/math";
import { Dispatcher } from "@ngrx/signals/events";
import { DocumentViewerService } from "@services/document-viewer.service";
import { SetSnippetRectAction } from "@store/document-snippets/document-snippet.actions";

@Component({
  selector: 'app-document-viewer-snippet-actions',
  templateUrl: './document-viewer-snippet-actions.component.html',
  styleUrls: ['./document-viewer-snippet-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentViewerSnippetActionsComponent {
  private readonly documentViewerService = inject(DocumentViewerService);
  private readonly dispatcher = inject(Dispatcher);

  readonly snippet = input.required<DocumentSnippetRect>();

  readonly directions: [Direction, Direction][] = [
    [-1, -1],  // left, top
    [0, -1],   // center, top
    [1, -1],   // right, top
    [-1, 0],   // left, center
    [1, 0],    // right, center
    [-1, 1],   // left, bottom
    [0, 1],    // center, bottom
    [1, 1],    // right, bottom
  ];

  private startLeft = 0;
  private startTop = 0;
  private startWidth = 0;
  private startHeight = 0;

  getDirectionName(x: Direction, y: Direction): Record<string, boolean> {
    const xName = DirectionXNamesByDirection[x];
    const yName = DirectionYNamesByDirection[y];
    const names = [xName, yName];

    return names.filter(Boolean).reduce((acc, name) => ({ ...acc, [name!]: true }), {});
  }

  onStart({ startX, startY }: DragStartEvent) {
    const snippet = this.snippet();
    const moveX = this.documentViewerService.getUnShiftedUnZoomedX(startX);
    const moveY = this.documentViewerService.getUnShiftedUnZoomedY(startY);

    this.startLeft = moveX - snippet.left;
    this.startTop = moveY - snippet.top;
    this.startWidth = this.startLeft - snippet.width;
    this.startHeight = this.startTop - snippet.height;
  }

  onDragging(x: Direction, y: Direction, { clientX, clientY }: DraggingEvent): void {
    const snippet = this.snippet();
    const moveX = this.documentViewerService.getUnShiftedUnZoomedX(clientX);
    const moveY = this.documentViewerService.getUnShiftedUnZoomedY(clientY);
    const left = x < 0
      ? moveX - this.startLeft
      : snippet.left;
    const top = y < 0
      ? moveY - this.startTop
      : snippet.top;
    const width = x > 0
      ? moveX - snippet.left - this.startWidth
      : snippet.left + snippet.width - left;
    const height = y > 0
      ? moveY - snippet.top - this.startHeight
      : snippet.top + snippet.height - top;

    this.dispatcher.dispatch(SetSnippetRectAction({
      id: snippet.id,
      top,
      left,
      width,
      height,
    }));
  }
}
