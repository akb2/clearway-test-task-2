import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DirectivesModule } from "@modules/directives.module";
import { DocumentSnippetsStore } from "@store/document-snippets/document-snippet.store";
import { DocumentViewerSnippetResizerModule } from "../document-viewer-snippet-resizer/document-viewer-snippet-resizer.module";
import { DocumentViewerSnippetsHelperModule } from "../document-viewer-snippets-helper/document-viewer-snippets-helper.module";
import { DocumentViewerSnippetsComponent } from "./document-viewer-snippets.component";

@NgModule({
  declarations: [
    DocumentViewerSnippetsComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    DocumentViewerSnippetsHelperModule,
    DocumentViewerSnippetResizerModule,
  ],
  exports: [
    DocumentViewerSnippetsComponent
  ],
  providers: [
    DocumentSnippetsStore,
  ]
})
export class DocumentViewerSnippetsModule { }
