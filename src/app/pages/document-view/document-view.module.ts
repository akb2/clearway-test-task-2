import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DocumentViewerModule } from "@components/views/document-viewer/document-viewer.module";
import { NoSubRoutes } from "@helpers/app";
import { DocumentViewComponent } from "./document-view.component";

@NgModule({
  declarations: [
    DocumentViewComponent
  ],
  imports: [
    RouterModule.forChild(NoSubRoutes(DocumentViewComponent)),
    CommonModule,
    DocumentViewerModule,
  ]
})
export class DocumentViewModule { }
