import { AfterViewInit, DestroyRef, Directive, ElementRef, inject, input, model, output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IsMacOs, IsSafari } from "@helpers/app";
import { AnyToInt } from "@helpers/converters";
import { Nullable } from "@models/app";
import { Direction } from "@models/math";
import { filter, fromEvent, pairwise, skipWhile, startWith, switchMap, tap, timer } from "rxjs";

@Directive({
  selector: "[scrollable]",
  standalone: false,
})
export class ScrollableDirective implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly inertion = input(true);
  readonly isScrolling = model(false);
  readonly disabledScroll = input(false);
  readonly disabledTopScroll = input(false);
  readonly disabledBottomScroll = input(false);
  readonly scrollStart = output<Direction>();
  readonly scrolling = output<void>();
  readonly scrollEnd = output<void>();

  private readonly endTime = 350;
  private readonly inertionDetectTime = 90;

  private isInertionEvent(cancelable: boolean, timeStamp: number, lastTime: number): boolean {
    return IsMacOs() && IsSafari()
      ? timeStamp - lastTime <= this.inertionDetectTime
      : !cancelable && timeStamp > 0;
  }

  private filterEvents([prev, next]: Nullable<WheelEvent>[]): boolean {
    const cancelable = !!next!.cancelable;
    const timeStamp = AnyToInt(next?.timeStamp);
    const lastTime = AnyToInt(prev?.timeStamp);
    const isInertion = this.isInertionEvent(cancelable, timeStamp, lastTime);

    return !isInertion || (isInertion && this.inertion());
  }

  private getFilterOperator<T extends Nullable<WheelEvent>>() {
    return IsMacOs() && IsSafari()
      ? skipWhile((data: T[]) => this.filterEvents(data))
      : filter((data: T[]) => this.filterEvents(data));
  }

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>
  ) { }

  ngAfterViewInit() {
    this.wheelListener();
  }

  private wheelListener() {
    fromEvent<WheelEvent>(this.elementRef.nativeElement, "wheel", { passive: false })
      .pipe(
        startWith(undefined),
        pairwise(),
        this.getFilterOperator(),
        tap(([, event]) => this.onScrollStart(event!)),
        switchMap(() => timer(this.endTime)),
        filter(() => this.isScrolling()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.onScrollEnd());
  }

  private onScrollStart(event: WheelEvent) {
    const direction = Math.sign(event.deltaY) as Direction;
    const disabledTop = this.disabledTopScroll() && direction < 0;
    const disabledBottom = this.disabledBottomScroll() && direction > 0;

    if (!this.isScrolling()) {
      if (!this.disabledScroll() && !disabledTop && !disabledBottom) {
        this.isScrolling.set(true);
        this.scrollStart.emit(direction);
      }
    }

    if (this.isScrolling()) {
      this.scrolling.emit();
    }
  }

  private onScrollEnd() {
    this.isScrolling.set(false);
    this.scrollEnd.emit();
  }
}
