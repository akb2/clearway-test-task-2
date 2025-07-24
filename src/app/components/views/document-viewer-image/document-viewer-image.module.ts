import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DirectivesModule } from "@modules/directives.module";
import { DocumentViewerSnippetsModule } from "../document-viewer-snippets/document-viewer-snippets.module";
import { DocumentViewerImageComponent } from "./document-viewer-image.component";

@NgModule({
  declarations: [
    DocumentViewerImageComponent,
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    DocumentViewerSnippetsModule,
  ],
  exports: [
    DocumentViewerImageComponent,
  ]
})
export class DocumentViewerImageModule { }
