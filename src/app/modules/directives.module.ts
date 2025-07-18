import { NgModule } from '@angular/core';
import { DragDirective } from "@directives/drag.directive";
import { ResizeObserverDirective } from "@directives/resize-observer.directive";

@NgModule({
  declarations: [
    ResizeObserverDirective,
    DragDirective
  ],
  imports: [],
  exports: [
    ResizeObserverDirective,
    DragDirective
  ]
})
export class DirectivesModule { }
