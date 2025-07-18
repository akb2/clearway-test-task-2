import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DirectivesModule } from "@modules/directives.module";
import { DocumentViewerActionsModule } from "../document-viewer-actions/document-viewer-actions.module";
import { DocumentViewerComponent } from './document-viewer.component';

@NgModule({
  declarations: [
    DocumentViewerComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    DocumentViewerActionsModule,
  ],
  exports: [
    DocumentViewerComponent
  ]
})
export class DocumentViewerModule { }
