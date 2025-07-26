import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-document-viewer-snippet-action',
  templateUrl: './document-viewer-snippet-action.component.html',
  styleUrls: ['./document-viewer-snippet-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentViewerSnippetActionComponent {
  readonly icon = input.required();
  readonly disabled = input(false);

  readonly action = output();

  onClick() {
    if (!this.disabled()) {
      this.action.emit();
    }
  }
}
