import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { RouterStateUrl } from "@models/app";
import { RouterStateSerializer } from "@ngrx/router-store";
import { AnyToString } from "./converters";

export class RouterSerializer implements RouterStateSerializer<RouterStateUrl> {
  private extractRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    while (route.firstChild) {
      route = route.firstChild;
    }

    return route;
  }

  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const { queryParams } = routerState.root;
    const { params, data } = this.extractRoute(routerState.root);
    const title = AnyToString(data?.["title"]);

    return { url, params, queryParams, title };
  }
}
