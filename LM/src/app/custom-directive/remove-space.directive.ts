// import {Directive, ElementRef, HostListener, OnInit} from '@angular/core';

// @Directive({
//   selector: '[appRemoveSpace]'
// })
// export class RemoveSpaceDirective implements OnInit{
//   element :ElementRef;
//   constructor(public el: ElementRef) {
// this.element = el

//   }
//   ngOnInit(){
//   }
//   @HostListener('keyup') onKeyup(){
//     this.element.nativeElement.value = this.element.nativeElement.value.replace(/\s\s+/g, ' ');
//     this.element.nativeElement.value = this.element.nativeElement.value[0].trim().toUpperCase()+this.element.nativeElement.value.slice(1);

//   }

// }
import { Directive, ElementRef, forwardRef, HostListener, Renderer2, StaticProvider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const CUSTOM_INPUT_DATE_PICKER_CONTROL_VALUE_ACCESSOR: StaticProvider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RemoveSpaceDirective),
    multi: true
};

@Directive({
    selector: '[appRemoveSpace]',
    providers: [CUSTOM_INPUT_DATE_PICKER_CONTROL_VALUE_ACCESSOR]
})
export class RemoveSpaceDirective implements ControlValueAccessor {
    private onChange!: (val: string) => void;
    private onTouched!: () => void;
    private value!: string;

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) {
    }

    @HostListener('input', ['$event.target.value'])
    onInputChange(value: string) {
        const filteredValue: string = filterValue(value);
        this.updateTextInput(filteredValue, this.value !== filteredValue);
    }

    @HostListener('blur')
    onBlur() {
        this.onTouched();
    }

    private updateTextInput(value: string, propagateChange: boolean) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
        if (propagateChange) {
            this.onChange(value);
        }
        this.value = value;
    }

    // ControlValueAccessor Interface
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }

    writeValue(value: any): void {
        value = value ? String(value) : '';
        this.updateTextInput(value, false);
    }
}

function filterValue(value:any): string {
    return value.replace(/\s\s+/g, ' ');
}
