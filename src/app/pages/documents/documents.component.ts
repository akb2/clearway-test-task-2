import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { initialLoadDocumentsAction } from "@app/store/document/document.actions";
import { documentsListSelector } from "@app/store/document/document.selectors";
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DocumentsComponent implements OnInit {
  readonly documents$ = this.store$.select(documentsListSelector);

  constructor(
    private readonly store$: Store
  ) { }

  ngOnInit() {
    this.store$.dispatch(initialLoadDocumentsAction());
  }
}
