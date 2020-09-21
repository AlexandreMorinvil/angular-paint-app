export abstract class ToolModifier<T> {
    protected parameter: T;

    constructor(initialValue: T) {
        this.parameter = initialValue;
    }

    get value(): T {
        return this.parameter;
    }

    set value(input:T) {
        this.parameter = input;
    }
}