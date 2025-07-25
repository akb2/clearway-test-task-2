import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DocumentSnippetsStore } from "@store/document-snippets/document-snippet.store";
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
  ],
  providers: [
    DocumentSnippetsStore,
  ]
})
export class DocumentViewerSnippetsModule { }
