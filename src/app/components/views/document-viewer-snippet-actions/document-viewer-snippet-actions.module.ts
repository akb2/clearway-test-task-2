import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { DirectivesModule } from "@modules/directives.module";
import { DocumentViewerSnippetActionsComponent } from "./document-viewer-snippet-actions.component";

@NgModule({
  imports: [
    CommonModule,
    DirectivesModule,
    MatIconModule,
    FormsModule,
  ],
  declarations: [
    DocumentViewerSnippetActionsComponent,
  ],
  exports: [
    DocumentViewerSnippetActionsComponent,
  ]
})
export class DocumentViewerSnippetActionsModule { }
