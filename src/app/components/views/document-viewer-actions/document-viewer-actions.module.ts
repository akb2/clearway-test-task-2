import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { DocumentViewerActionsComponent } from "./document-viewer-actions.component";

@NgModule({
  declarations: [
    DocumentViewerActionsComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [
    DocumentViewerActionsComponent
  ]
})
export class DocumentViewerActionsModule { }
