import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { DocumentViewerSnippetActionComponent } from './document-viewer-snippet-action.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
  ],
  declarations: [
    DocumentViewerSnippetActionComponent,
  ],
  exports: [
    DocumentViewerSnippetActionComponent,
  ]
})
export class DocumentViewerSnippetActionModule { }
