import { NgModule } from '@angular/core';
import { DragDirective } from "@directives/drag.directive";
import { ResizeObserverDirective } from "@directives/resize-observer.directive";
import { ScrollableDirective } from "@directives/scrollable.directive";

@NgModule({
  declarations: [
    ResizeObserverDirective,
    DragDirective,
    ScrollableDirective
  ],
  imports: [],
  exports: [
    ResizeObserverDirective,
    DragDirective,
    ScrollableDirective
  ]
})
export class DirectivesModule { }
