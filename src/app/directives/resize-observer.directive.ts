import { AfterViewInit, Directive, ElementRef, OnDestroy, OnInit, output } from "@angular/core";
import { CompareObjects } from "@helpers/app";
import { DefaultRectData } from "@helpers/ui";
import { RectData, ResizeEvent } from "@models/ui";
import { fromEvent, Subject, takeUntil } from "rxjs";

@Directive({
  selector: '[resizeObserver]',
  standalone: false
})
export class ResizeObserverDirective implements OnInit, AfterViewInit, OnDestroy {
  readonly resized = output<ResizeEvent>();

  private lastEventData: ResizeEvent = DefaultRectData;

  private readonly destroyed$ = new Subject<void>();

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
    const eventData = this.getRectData();

    if (!CompareObjects(eventData, this.lastEventData)) {
      this.lastEventData = eventData;
      this.resized.emit(eventData);
    }
  }
}
