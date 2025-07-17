import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BrowserModule } from "@angular/platform-browser";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from "@angular/router";
import { RouterSerializer } from "@helpers/router-serializer";
import { EffectsModule } from "@ngrx/effects";
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { AppComponent } from "./app.component";
import { routes } from "./app.routes";
import { HeaderModule } from "./components/sections/header/header.module";
import { AssetsImagesPath, AssetsMockPath } from "./data/app";
import { appEffects } from "./store/app.effects";
import { appReducer } from "./store/app.reducer";
import { LayoutStore } from "./store/layout/layout.store";

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
    HeaderModule,
    StoreRouterConnectingModule.forRoot({ serializer: RouterSerializer }),
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: AssetsImagesPath, useValue: "/assets/images/" },
    { provide: AssetsMockPath, useValue: "/assets/mock/" },
    { provide: RouterStateSerializer, useClass: RouterSerializer },
    LayoutStore,
  ]
})
export class AppModule { }
