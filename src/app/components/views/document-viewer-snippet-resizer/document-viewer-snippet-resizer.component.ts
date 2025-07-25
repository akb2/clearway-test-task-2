import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-document-viewer-snippet-resizer',
  templateUrl: './document-viewer-snippet-resizer.component.html',
  styleUrls: ['./document-viewer-snippet-resizer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentViewerSnippetResizerComponent {
}
