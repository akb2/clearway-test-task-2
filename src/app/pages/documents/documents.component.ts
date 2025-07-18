import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DocumentStore } from "@store/document/document.store";

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentsComponent {
  private readonly documentStore = inject(DocumentStore);

  readonly documents = this.documentStore.documents;
}
