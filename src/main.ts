import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";

const providers = [{
  provide: "BASE_URL",
  useFactory: () => document.getElementsByTagName("base")[0].href
}];

platformBrowserDynamic(providers)
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
