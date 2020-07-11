export abstract class UiElement {
  protected elem: HTMLElement;

  // Create the component
  abstract create(): void;

  // Update the contents of the element
  abstract update(props?: any): void;

  constructor(protected parent?: HTMLElement) {
    if (!!parent) {
      this.create();
      this.mount(this.parent);
    }
  }

  // Mount the component to the parent container
  mount(container: HTMLElement) {
    container.appendChild(this.elem);
  }
}