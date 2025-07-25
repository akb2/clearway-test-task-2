import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DirectionXNamesByDirection, DirectionYNamesByDirection } from "@helpers/math";
import { Direction } from "@models/math";

@Component({
  selector: 'app-document-viewer-snippet-resizer',
  templateUrl: './document-viewer-snippet-resizer.component.html',
  styleUrls: ['./document-viewer-snippet-resizer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentViewerSnippetResizerComponent {
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

  getDirectionName(x: Direction, y: Direction): Record<string, boolean> {
    const xName = DirectionXNamesByDirection[x];
    const yName = DirectionYNamesByDirection[y];
    const names = [xName, yName];

    return names.filter(Boolean).reduce((acc, name) => ({ ...acc, [name!]: true }), {});
  }
}
