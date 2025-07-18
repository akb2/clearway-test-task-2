import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DocumentCardModule } from "@components/sections/views/document-card/document-card.module";
import { NoSubRoutes } from "@helpers/app";
import { DocumentsComponent } from "./documents.component";

@NgModule({
  declarations: [
    DocumentsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(NoSubRoutes(DocumentsComponent)),
    DocumentCardModule
  ]
})
export class DocumentsModule { }
