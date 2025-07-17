import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { pageTitleSelector } from "@app/store/layout-old/layout.selectors";
import { Store } from "@ngrx/store";
import { map } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class HeaderComponent {
  @Input() breadCrumbs: any[] = [];

  readonly title$ = this.store$.select(pageTitleSelector).pipe(
    map(pageTitle => !!pageTitle?.length
      ? pageTitle
      : "Тестовое задание"
    )
  );

  constructor(
    private readonly store$: Store,
  ) { }
}
