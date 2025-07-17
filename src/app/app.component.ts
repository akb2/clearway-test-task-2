import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LayoutStore } from "./store/layout/layout.store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AppComponent {
  private readonly layoutStore = inject(LayoutStore);

  readonly loading = this.layoutStore.pageLoading;
}
