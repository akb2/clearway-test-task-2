import { AfterViewInit, Directive, ElementRef, input, model, OnDestroy, output } from "@angular/core";
import { Direction } from "@models/app";
import { filter, fromEvent, Subject, switchMap, takeUntil, tap, timer } from "rxjs";

@Directive({
  selector: "[scrollable]",
  standalone: false,
})
export class ScrollableDirective implements AfterViewInit, OnDestroy {
  readonly inertion = input(true);
  readonly isScrolling = model(false);
  readonly disabledScroll = input(false);
  readonly disabledTopScroll = input(false);
  readonly disabledBottomScroll = input(false);
  readonly scrollStart = output<Direction>();
  readonly scrolling = output<void>();
  readonly scrollEnd = output<void>();

  private readonly endTime = 200;

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>
  ) { }

  ngAfterViewInit() {
    this.wheelListener();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private wheelListener() {
    fromEvent<WheelEvent>(this.elementRef.nativeElement, "wheel", { passive: this.inertion() })
      .pipe(
        filter(({ cancelable }) => cancelable || (!cancelable && this.inertion())),
        tap(event => this.onScrollStart(Math.sign(event.deltaY) as Direction)),
        switchMap(() => timer(this.endTime)),
        filter(() => this.isScrolling()),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => this.onScrollEnd());
  }

  private onScrollStart(direction: Direction) {
    const disabledTop = this.disabledTopScroll() && direction < 0;
    const disabledBottom = this.disabledBottomScroll() && direction > 0;

    if (!this.disabledScroll() && !disabledTop && !disabledBottom && !disabledBottom && !this.isScrolling()) {
      this.isScrolling.set(true);
      this.scrollStart.emit(direction);
    }

    this.scrolling.emit();
  }

  private onScrollEnd() {
    this.isScrolling.set(false);
    this.scrollEnd.emit();
  }
}
