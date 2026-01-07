import "@testing-library/jest-dom";

// JSDOM does not ship ResizeObserver; mock it for layout-driven components.
class ResizeObserverMock {
  /**
   * What it does:
   * Stub method for ResizeObserver.observe.
   * Why it exists:
   * Tests need a no-op implementation for layout observers.
   *
   * @returns Void.
   *
   * @throws None.
   * @sideEffects None.
   *
   * Edge cases:
   * - Does not emit resize entries in JSDOM.
   */
  observe(): void {
    // No-op: JSDOM does not calculate layout.
  }
  /**
   * What it does:
   * Stub method for ResizeObserver.unobserve.
   * Why it exists:
   * Keeps cleanup calls safe in tests.
   *
   * @returns Void.
   *
   * @throws None.
   * @sideEffects None.
   *
   * Edge cases:
   * - No-op for JSDOM.
   */
  unobserve(): void {
    // No-op: JSDOM does not calculate layout.
  }
  /**
   * What it does:
   * Stub method for ResizeObserver.disconnect.
   * Why it exists:
   * Avoids errors when components disconnect observers in tests.
   *
   * @returns Void.
   *
   * @throws None.
   * @sideEffects None.
   *
   * Edge cases:
   * - No-op for JSDOM.
   */
  disconnect(): void {
    // No-op: JSDOM does not calculate layout.
  }
}

Object.defineProperty(globalThis, "ResizeObserver", {
  value: ResizeObserverMock,
});
