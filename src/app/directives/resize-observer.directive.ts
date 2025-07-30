import { AfterViewInit, DestroyRef, Directive, ElementRef, inject, OnDestroy, OnInit, output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CompareObjects } from "@helpers/app";
import { DefaultRectData } from "@helpers/ui";
import { RectData, ResizeEvent } from "@models/ui";
import { fromEvent } from "rxjs";

@Directive({
  selector: '[resizeObserver]',
  standalone: false
})
export class ResizeObserverDirective implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  readonly resized = output<ResizeEvent>();

  private lastEventData: ResizeEvent = DefaultRectData;

  private resizeObserver$ = new ResizeObserver(entries => entries.forEach(this.onResized.bind(this)));

  private getRectData(): RectData {
    const clientRect = this.elementRef.nativeElement.getBoundingClientRect();

    return {
      width: Math.round(clientRect.width),
      height: Math.round(clientRect.height),
      left: Math.round(clientRect.left),
      top: Math.round(clientRect.top),
    };
  }

  constructor(
    private elementRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit() {
    fromEvent(window, "resize")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(this.onResized.bind(this));
  }

  ngAfterViewInit() {
    this.resizeObserver$.observe(this.elementRef.nativeElement);

    this.onResized();
  }

  ngOnDestroy() {
    this.resizeObserver$.disconnect();
  }

  private onResized() {
    const eventData = this.getRectData();

    if (!CompareObjects(eventData, this.lastEventData)) {
      this.lastEventData = eventData;
      this.resized.emit(eventData);
    }
  }
}
