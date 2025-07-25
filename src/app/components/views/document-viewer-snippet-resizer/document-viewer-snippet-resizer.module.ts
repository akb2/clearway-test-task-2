import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DirectivesModule } from "@modules/directives.module";
import { DocumentViewerSnippetResizerComponent } from "./document-viewer-snippet-resizer.component";

@NgModule({
  imports: [
    CommonModule,
    DirectivesModule
  ],
  declarations: [
    DocumentViewerSnippetResizerComponent,
  ],
  exports: [
    DocumentViewerSnippetResizerComponent,
  ]
})
export class DocumentViewerSnippetResizerModule { }
