import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DirectivesModule } from "@modules/directives.module";
import { DocumentSnippetsStore } from "@store/document-snippets/document-snippet.store";
import { DocumentViewerSnippetActionsModule } from "../document-viewer-snippet-actions/document-viewer-snippet-actions.module";
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
    DocumentViewerSnippetActionsModule,
    MatTooltipModule,
  ],
  exports: [
    DocumentViewerSnippetsComponent
  ],
  providers: [
    DocumentSnippetsStore,
  ]
})
export class DocumentViewerSnippetsModule { }
