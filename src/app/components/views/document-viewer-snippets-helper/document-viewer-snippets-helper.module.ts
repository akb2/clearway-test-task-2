import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DirectivesModule } from "@modules/directives.module";
import { DocumentViewerSnippetsHelperComponent } from "./document-viewer-snippets-helper.component";

@NgModule({
  declarations: [
    DocumentViewerSnippetsHelperComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
  ],
  exports: [
    DocumentViewerSnippetsHelperComponent
  ]
})
export class DocumentViewerSnippetsHelperModule { }
