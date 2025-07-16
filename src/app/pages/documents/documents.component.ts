import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { initialLoadDocumentsAction } from "@app/store/document/document.actions";
import { documentsListSelector } from "@app/store/document/document.selectors";
import { Store } from "@ngrx/store";
import { BehaviorSubject, filter, map, pairwise, startWith, tap } from "rxjs";

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsComponent implements OnInit, OnDestroy {
  readonly documents$ = this.store$.select(documentsListSelector);

  readonly loading$ = new BehaviorSubject(true);

  constructor(
    private readonly store$: Store
  ) { }

  ngOnInit() {
    this.store$.dispatch(initialLoadDocumentsAction());
  }

  ngOnDestroy(): void {
    this.loading$.complete();
  }
}
