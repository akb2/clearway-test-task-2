import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BrowserModule } from "@angular/platform-browser";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from "@angular/router";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { AppComponent } from "./app.component";
import { routes } from "./app.routes";
import { AssetsImagesPath, AssetsMockPath } from "./data/app";
import { appEffects } from "./store/app.effects";
import { appReducer } from "./store/app.reducer";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot(appEffects),
    RouterModule.forRoot(routes),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    MatProgressSpinnerModule,
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: AssetsImagesPath, useValue: "/assets/images/" },
    { provide: AssetsMockPath, useValue: "/assets/mock/" },
  ]
})
export class AppModule { }
