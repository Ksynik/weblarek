import { Component } from '../base/Component';


export interface IFormState {
    valid: boolean;
    errors: string[];
}

export abstract class Form<T = any> extends Component<{}> {
    protected _form: HTMLFormElement;
    private _submitHandlers: ((data: T) => void)[] = [];

    constructor(container: HTMLFormElement) {
        super(container);
        this._form = container;

        this._form.addEventListener('submit', (event: SubmitEvent) => {
            event.preventDefault();
            this.handleSubmit();
        });
    }

    protected abstract validate(): boolean;
    protected abstract getFormData(): T;

    protected handleSubmit(): void {
        if (this.validate()) {
            const formData = this.getFormData();
            this._submitHandlers.forEach(handler => handler(formData));
        }
    }

    set onSubmit(handler: (data: T) => void) {
        this._submitHandlers.push(handler);
    }

    clear(): void {
        this._form.reset();
    }
}