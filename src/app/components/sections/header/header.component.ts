import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { LayoutStore } from "@store/layout/layout.store";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class HeaderComponent {
  private readonly layoutStore = inject(LayoutStore);

  readonly title = this.layoutStore.pageTitle;

  @Input() breadCrumbs: any[] = [];
}
