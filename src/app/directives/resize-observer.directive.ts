import { AfterViewInit, Directive, ElementRef, OnDestroy, OnInit, output } from "@angular/core";
import { ResizeEvent } from "@models/ui";
import { fromEvent, Subject, takeUntil } from "rxjs";

@Directive({
  selector: '[resizeObserver]',
  standalone: false
})
export class ResizeObserverDirective implements OnInit, AfterViewInit, OnDestroy {
  readonly resized = output<ResizeEvent>();

  private readonly destroyed$ = new Subject<void>();

  private resizeObserver$ = new ResizeObserver(entries => entries.forEach(this.onResized.bind(this)));

  constructor(
    private elementRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit() {
    fromEvent(window, "resize")
      .pipe(takeUntil(this.destroyed$))
      .subscribe(this.onResized.bind(this));
  }

  ngAfterViewInit() {
    this.resizeObserver$.observe(this.elementRef.nativeElement);

    this.onResized();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.resizeObserver$.disconnect();
  }

  private onResized() {
    const { width, height, left, top } = this.elementRef.nativeElement.getBoundingClientRect();
    this.resized.emit({ width, height, left, top });
  }
}
