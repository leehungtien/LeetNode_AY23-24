class Stack<T> {
    private items: T[];
  
    constructor() {
      this.items = [];
    }
  
    push(item: T): void {
      this.items.push(item);
    }
  
    pop(): T | undefined {
      return this.items.pop();
    }
  
    peek(): T | undefined {
      return this.items[this.items.length - 1];
    }
  
    isEmpty(): boolean {
      return this.items.length === 0;
    }
  
    size(): number {
      return this.items.length;
    }
  
    clear(): void {
      this.items = [];
    }
  
    // Add a method to clone the stack
    clone(): Stack<T> {
      const clonedStack = new Stack<T>();
      clonedStack.items = [...this.items];
      return clonedStack;
    }

    toArray(): T[] {
        return this.items.reduce((acc, curr) => acc.concat(curr), [] as T[]); // Flatten the nested arrays
    }


  }
  
  export default Stack;
  