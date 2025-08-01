import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DirectivesModule } from "@modules/directives.module";
import { DocumentViewerService } from "@services/document-viewer.service";
import { DocumentViewerStore } from "@store/document-viewer/document-viewer.store";
import { DocumentViewerActionsModule } from "../document-viewer-actions/document-viewer-actions.module";
import { DocumentViewerImageModule } from "../document-viewer-image/document-viewer-image.module";
import { DocumentViewerComponent } from './document-viewer.component';

@NgModule({
  declarations: [
    DocumentViewerComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    DocumentViewerActionsModule,
    DocumentViewerImageModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    DocumentViewerComponent
  ],
  providers: [
    DocumentViewerStore,
    DocumentViewerService,
  ]
})
export class DocumentViewerModule { }
