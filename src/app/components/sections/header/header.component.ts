import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NoHoverLink } from "@helpers/ui";
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

  readonly noHoverLink = NoHoverLink;

  readonly title = this.layoutStore.pageTitle;
  readonly breadCrumbs = this.layoutStore.breadCrumbs;
}
