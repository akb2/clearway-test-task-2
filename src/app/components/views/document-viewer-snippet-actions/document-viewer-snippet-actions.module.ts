import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DirectivesModule } from "@modules/directives.module";
import { DocumentViewerSnippetActionsComponent } from "./document-viewer-snippet-actions.component";

@NgModule({
  imports: [
    CommonModule,
    DirectivesModule
  ],
  declarations: [
    DocumentViewerSnippetActionsComponent,
  ],
  exports: [
    DocumentViewerSnippetActionsComponent,
  ]
})
export class DocumentViewerSnippetActionsModule { }
