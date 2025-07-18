import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DocumentViewerModule } from "@components/views/document-viewer/document-viewer.module";
import { NoSubRoutes } from "@helpers/app";
import { DocumentsViewComponent } from "./documents-view.component";

@NgModule({
  declarations: [
    DocumentsViewComponent
  ],
  imports: [
    RouterModule.forChild(NoSubRoutes(DocumentsViewComponent)),
    CommonModule,
    DocumentViewerModule
  ]
})
export class DocumentsViewModule { }
