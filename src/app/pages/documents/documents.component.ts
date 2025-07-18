import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Dispatcher } from "@ngrx/signals/events";
import { InitialLoadDocumentsAction } from "@store/document/document.actions";
import { DocumentStore } from "@store/document/document.store";

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentsComponent implements OnInit {
  private readonly documentStore = inject(DocumentStore);
  private readonly dispatcher = inject(Dispatcher);

  readonly documents = this.documentStore.documents;

  ngOnInit() {
    this.dispatcher.dispatch(InitialLoadDocumentsAction());
  }
}
