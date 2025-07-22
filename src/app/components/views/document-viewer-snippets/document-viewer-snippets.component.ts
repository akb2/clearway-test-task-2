import { ChangeDetectionStrategy, Component, model } from "@angular/core";

@Component({
  selector: "app-document-viewer-snippets",
  templateUrl: "./document-viewer-snippets.component.html",
  styleUrl: "./document-viewer-snippets.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentViewerSnippetsComponent {
  readonly isSnippetHelperDragging = model(false);
}
