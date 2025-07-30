import { DestroyRef, inject, isDevMode } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { getState, signalStoreFeature, withHooks } from "@ngrx/signals";
import { EventCreator, Events } from "@ngrx/signals/events";
import { filter } from "rxjs";

export const debugActions = (actions: EventCreator<string, any>[]) => signalStoreFeature(withHooks((
  store,
  events = inject(Events),
  destroyRef = inject(DestroyRef),
) => {
  const tagColor = "color: lightgreen; font-weight: bold;";
  const tagErrorColor = "color: red; font-weight: bold;";
  const titleColor = "color: lightgray; font-weight: normal;";
  const varColor = "color: orange; font-weight: bold;";
  const defaultColor = "color: lightgray; font-weight: normal;";

  const onInit = () => events.on(...actions)
    .pipe(
      filter(() => isDevMode()),
      takeUntilDestroyed(destroyRef)
    )
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

  return { onInit };
}));
