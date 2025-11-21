/**
 * Plugin Event Bus
 * 플러그인 간 이벤트 통신을 위한 Event Bus
 */

type EventHandler<T = unknown> = (data: T) => void;

class EventBus {
  private events: Map<string, Set<EventHandler>>;

  constructor() {
    this.events = new Map();
  }

  on<T = unknown>(event: string, handler: EventHandler<T>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const handlers = this.events.get(event)!;
    handlers.add(handler as EventHandler);

    // Unsubscribe function
    return () => {
      handlers.delete(handler as EventHandler);
      if (handlers.size === 0) {
        this.events.delete(event);
      }
    };
  }

  emit<T = unknown>(event: string, data?: T): void {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      });
    }
  }

  off(event: string, handler?: EventHandler): void {
    if (handler) {
      const handlers = this.events.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.events.delete(event);
        }
      }
    } else {
      this.events.delete(event);
    }
  }

  clear(): void {
    this.events.clear();
  }
}

// Singleton instance
export const eventBus = new EventBus();
