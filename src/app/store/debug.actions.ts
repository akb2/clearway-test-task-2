import { inject } from "@angular/core";
import { getState, signalStoreFeature, withHooks } from "@ngrx/signals";
import { EventCreator, Events } from "@ngrx/signals/events";
import { Subject, takeUntil } from "rxjs";

export const debugActions = (actions: EventCreator<string, any>[]) => signalStoreFeature(withHooks((store, events = inject(Events)) => {
  const destroyed$ = new Subject<void>();

  const tagColor = "color: lightgreen; font-weight: bold;";
  const tagErrorColor = "color: red; font-weight: bold;";
  const titleColor = "color: lightgray; font-weight: normal;";
  const varColor = "color: orange; font-weight: bold;";
  const defaultColor = "color: lightgray; font-weight: normal;";

  const onInit = () => events.on(...actions)
    .pipe(takeUntil(destroyed$))
    .subscribe({
      next: ({ type, payload }) => {
        const regExp = new RegExp("^\\[(.+)\\](.*)$", "i");
        const tag = type.replace(regExp, "[$1]");
        const text = type.replace(regExp, "$2");

        console.log(
          "\n%c[СТОР]" + tag + "%c" + text + "\n\n%cЗначение: %c%o\n%cСостояние: %c%o\n\n",
          tagColor,
          defaultColor,
          titleColor,
          varColor,
          payload,
          titleColor,
          varColor,
          getState(store)
        )
      },
      error: error => console.error(
        "%c[СТОР] %cОшибка\n%c%o",
        tagErrorColor,
        defaultColor,
        varColor,
        error
      )
    });

  const onDestroy = () => {
    destroyed$.next();
    destroyed$.complete();
  };

  return { onInit, onDestroy };
}));
