import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DirectivesModule } from "@modules/directives.module";
import { DocumentViewerActionsModule } from "../document-viewer-actions/document-viewer-actions.module";
import { DocumentViewerSnippetsModule } from "../document-viewer-snippets/document-viewer-snippets.module";
import { DocumentViewerComponent } from './document-viewer.component';

@NgModule({
  declarations: [
    DocumentViewerComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    DocumentViewerActionsModule,
    MatProgressSpinnerModule,
    DocumentViewerSnippetsModule,
  ],
  exports: [
    DocumentViewerComponent
  ]
})
export class DocumentViewerModule { }
