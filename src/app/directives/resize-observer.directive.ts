import { AfterViewInit, Directive, ElementRef, OnDestroy, output } from "@angular/core";

@Directive({
  selector: '[resizeObserver]',
  standalone: false
})
export class ResizeObserverDirective implements AfterViewInit, OnDestroy {
  readonly resized = output<ResizeObserverEntry>();

  private resizeObserver$ = new ResizeObserver(entries => entries.forEach(entry => this.resized.emit(entry)));

  constructor(
    private elementRef: ElementRef
  ) { }

  ngAfterViewInit(): void {
    this.resizeObserver$.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver$.disconnect();
  }
}
