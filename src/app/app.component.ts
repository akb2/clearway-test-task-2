import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { pageLoadingStateSelector } from "./store/layout/layout.selectors";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AppComponent {
  readonly loading$ = this.store$.select(pageLoadingStateSelector);

  constructor(
    private readonly store$: Store
  ) { }
}
