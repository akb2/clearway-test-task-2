import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DocumentCardModule } from "@components/views/document-card/document-card.module";
import { NoSubRoutes } from "@helpers/app";
import { DocumentPagesComponent } from "./document-pages.component";

@NgModule({
  declarations: [
    DocumentPagesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(NoSubRoutes(DocumentPagesComponent)),
    DocumentCardModule
  ]
})
export class DocumentPagesModule { }
