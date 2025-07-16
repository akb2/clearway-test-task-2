import { NgModule } from "@angular/core";
import { DocumentsComponent } from "./documents.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    DocumentsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: "", component: DocumentsComponent }])
  ]
})
export class DocumentsModule { }
