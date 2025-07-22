import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DocumentViewerSnippetsHelperModule } from "../document-viewer-snippets-helper/document-viewer-snippets-helper.module";
import { DocumentViewerSnippetsComponent } from "./document-viewer-snippets.component";

@NgModule({
  declarations: [
    DocumentViewerSnippetsComponent
  ],
  imports: [
    CommonModule,
    DocumentViewerSnippetsHelperModule,
  ],
  exports: [
    DocumentViewerSnippetsComponent
  ]
})
export class DocumentViewerSnippetsModule { }
