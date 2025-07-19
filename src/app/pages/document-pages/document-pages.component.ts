import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DocumentStore } from "@store/document/document.store";

@Component({
  selector: 'app-document-pages',
  templateUrl: './document-pages.component.html',
  styleUrl: './document-pages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentPagesComponent {
  private readonly documentStore = inject(DocumentStore);

  readonly documents = this.documentStore.documents;
}
