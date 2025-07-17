import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { LayoutStore } from "@app/store/layout/layout.store";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class HeaderComponent {
  @Input() breadCrumbs: any[] = [];

  private readonly layoutStore = inject(LayoutStore);

  readonly title = this.layoutStore.pageTitle;
}
