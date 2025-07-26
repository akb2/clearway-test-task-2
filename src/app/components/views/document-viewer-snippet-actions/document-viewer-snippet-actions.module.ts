import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from "@modules/directives.module";
import { DocumentViewerSnippetActionModule } from "../document-viewer-snippet-action/document-viewer-snippet-action.module";
import { DocumentViewerSnippetActionsComponent } from "./document-viewer-snippet-actions.component";

@NgModule({
  imports: [
    CommonModule,
    DirectivesModule,
    FormsModule,
    DocumentViewerSnippetActionModule,
  ],
  declarations: [
    DocumentViewerSnippetActionsComponent,
  ],
  exports: [
    DocumentViewerSnippetActionsComponent,
  ]
})
export class DocumentViewerSnippetActionsModule { }
