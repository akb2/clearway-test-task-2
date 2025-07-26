import { AfterViewInit, Directive, effect, ElementRef, input, model, OnDestroy, output } from "@angular/core";
import { DraggingEvent, DragStartEvent } from "@models/app";
import { filter, fromEvent, merge, Observable, Subject, takeUntil, tap } from "rxjs";

@Directive({
  selector: "[dragging]",
  standalone: false,
})
export class DragDirective implements AfterViewInit, OnDestroy {
  readonly disabledDrag = input(false);
  readonly strictTarget = input(false);
  readonly isDragging = model(false);
  readonly dragStart = output<DragStartEvent>();
  readonly dragging = output<DraggingEvent>();
  readonly dragEnd = output<void>();

  private lastX = 0;
  private lastY = 0;

  private readonly destroyed$ = new Subject<void>();

  private getEvent(elm: Node, eventName: string, callback: (event: MouseEvent) => void): Observable<MouseEvent> {
    return fromEvent<MouseEvent>(elm, eventName).pipe(
      filter(event => (
        (event.type !== "mousedown" && event.type !== "mouseup")
        || event.button === 0
      )),
      tap(event => {
        event.preventDefault();
        callback(event);
      }),
      takeUntil(this.destroyed$),
    );
  }

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>
  ) {
    this.disabledDragStateListener();
  }

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
    const strictTarget = this.strictTarget();
    const canStart = !strictTarget || event.target === this.elementRef.nativeElement;

    if (canStart && !this.disabledDrag()) {
      this.lastX = event.clientX;
      this.lastY = event.clientY;

      this.isDragging.set(true);
      this.dragStart.emit({
        startX: this.lastX,
        startY: this.lastY,
      });
    }
  }

  private onDragging({ clientX, clientY }: MouseEvent) {
    if (this.isDragging()) {
      if (!this.disabledDrag()) {
        const deltaX = clientX - this.lastX;
        const deltaY = clientY - this.lastY;

        this.lastX = clientX;
        this.lastY = clientY;

        this.dragging.emit({ deltaX, deltaY, clientX, clientY });
      }

      else {
        this.onDragEnd();
      }
    }
  }

  private onDragEnd() {
    if (this.isDragging()) {
      this.isDragging.set(false);
      this.dragEnd.emit();
    }
  }

  private disabledDragStateListener() {
    effect(() => {
      if (this.disabledDrag() && this.isDragging()) {
        this.onDragEnd();
      }
    });
  }
}
