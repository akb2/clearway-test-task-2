import { AfterViewInit, Directive, ElementRef, OnDestroy, output } from "@angular/core";
import { DraggingEvent, DragStartEvent } from "@models/app";
import { fromEvent, merge, Observable, Subject, takeUntil, tap } from "rxjs";

@Directive({
  selector: "[dragging]",
  standalone: false,
})
export class DragDirective implements AfterViewInit, OnDestroy {
  readonly dragStart = output<DragStartEvent>();
  readonly dragging = output<DraggingEvent>();
  readonly dragEnd = output<void>();

  private isDragging = false;
  private lastX = 0;
  private lastY = 0;

  private readonly destroyed$ = new Subject<void>();

  private getEvent(elm: Node, eventName: string, callback: (event: MouseEvent) => void): Observable<MouseEvent> {
    return fromEvent<MouseEvent>(elm, eventName).pipe(
      takeUntil(this.destroyed$),
      tap(event => {
        event.preventDefault();
        callback(event);
      }),
    );
  }

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>
  ) { }

  ngAfterViewInit() {
    merge(
      this.getEvent(document, "mouseup", this.onDragEnd.bind(this)),
      this.getEvent(document, "mousemove", this.onDragging.bind(this)),
      this.getEvent(this.elementRef.nativeElement, "mousedown", this.onDragStart.bind(this))
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private onDragStart(event: MouseEvent) {
    this.isDragging = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;

    this.dragStart.emit({
      startX: this.lastX,
      startY: this.lastY,
    });
  }

  private onDragging(event: MouseEvent) {
    if (this.isDragging) {
      const deltaX = event.clientX - this.lastX;
      const deltaY = event.clientY - this.lastY;

      this.lastX = event.clientX;
      this.lastY = event.clientY;

      this.dragging.emit({ deltaX, deltaY });
    }
  }

  private onDragEnd(event: MouseEvent) {
    this.isDragging = false;

    this.dragEnd.emit();
  }
}
