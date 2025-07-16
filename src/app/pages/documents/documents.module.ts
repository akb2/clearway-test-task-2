import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DocumentsComponent } from "./documents.component";
import { DocumentCardModule } from "@app/components/sections/views/document-card/document-card.module";

@NgModule({
  declarations: [
    DocumentsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: "", component: DocumentsComponent }]),
    DocumentCardModule
  ]
})
export class DocumentsModule { }
