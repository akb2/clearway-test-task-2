import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Clamp, DirectionXNamesByDirection, DirectionYNamesByDirection } from "@helpers/math";
import { DraggingEvent, DragStartEvent } from "@models/app";
import { DocumentSnippet } from "@models/document";
import { Direction } from "@models/math";
import { Dispatcher } from "@ngrx/signals/events";
import { DocumentViewerService } from "@services/document-viewer.service";
import { ClearEditingIdAction, DeleteSnippetAction, SetEditingIdAction, SetSnippetRectAction, SetSnippetTextAxtion } from "@store/document-snippets/document-snippet.actions";
import { DocumentSnippetsStore } from "@store/document-snippets/document-snippet.store";
import { DocumentViewerStore } from "@store/document-viewer/document-viewer.store";

@Component({
  selector: 'app-document-viewer-snippet-actions',
  templateUrl: './document-viewer-snippet-actions.component.html',
  styleUrls: ['./document-viewer-snippet-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentViewerSnippetActionsComponent {
  private readonly documentViewerStore = inject(DocumentViewerStore);
  private readonly documentSnippetsStore = inject(DocumentSnippetsStore);
  private readonly documentViewerService = inject(DocumentViewerService);
  private readonly dispatcher = inject(Dispatcher);

  readonly snippet = input.required<DocumentSnippet>();

  readonly editingText = signal("");

  private readonly imageOriginalWidth = this.documentViewerStore.imageOriginalWidth;
  private readonly imageOriginalHeight = this.documentViewerStore.imageOriginalHeight;

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

  readonly isEditingSignal = computed(() => this.snippet().id === this.documentSnippetsStore.editingId());

  readonly isHasChanges = computed(() => {
    const text = this.editingText();

    return !!text && this.snippet().text !== text;
  });

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
      ? Clamp(moveX - this.startLeft, 0, snippet.left + snippet.width)
      : snippet.left;
    const top = y < 0
      ? Clamp(moveY - this.startTop, 0, snippet.top + snippet.height)
      : snippet.top;
    const width = x > 0
      ? Clamp(moveX - snippet.left - this.startWidth, 0, this.imageOriginalWidth() - snippet.left)
      : snippet.left + snippet.width - left;
    const height = y > 0
      ? Clamp(moveY - snippet.top - this.startHeight, 0, this.imageOriginalHeight() - snippet.top)
      : snippet.top + snippet.height - top;

    this.dispatcher.dispatch(SetSnippetRectAction({
      id: snippet.id,
      top,
      left,
      width,
      height,
    }));
  }

  onEdit() {
    this.dispatcher.dispatch(SetEditingIdAction(this.snippet().id));

    this.editingText.set(this.snippet().text);
  }

  onSave() {
    this.dispatcher.dispatch(SetSnippetTextAxtion({
      id: this.snippet().id,
      text: this.editingText(),
    }));
    this.dispatcher.dispatch(ClearEditingIdAction());
  }

  onDelete() {
    this.dispatcher.dispatch(this.isEditingSignal()
      ? ClearEditingIdAction()
      : DeleteSnippetAction(this.snippet().id)
    );
  }
}
