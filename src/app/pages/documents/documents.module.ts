import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DocumentsComponent } from "./documents.component";

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
