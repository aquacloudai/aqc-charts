export interface AxisConfig {
    readonly label?: string;
    readonly type?: 'linear' | 'category' | 'time' | 'log' | 'value';
    readonly min?: number | string | Date;
    readonly max?: number | string | Date;
    readonly format?: string;
    readonly grid?: boolean;
    readonly gridColor?: string;
    readonly tickInterval?: number;
    readonly rotate?: number;
    readonly boundaryGap?: boolean;
    readonly parseDate?: boolean;
    readonly name?: string;
    readonly nameLocation?: 'start' | 'middle' | 'end';
    readonly nameGap?: number;
    readonly position?: 'left' | 'right' | 'top' | 'bottom';
    readonly data?: readonly any[];
}
export interface LegendConfig {
    readonly show?: boolean;
    readonly position?: 'top' | 'bottom' | 'left' | 'right';
    readonly align?: 'start' | 'center' | 'end';
    readonly orientation?: 'horizontal' | 'vertical';
}
export interface TooltipConfig {
    readonly show?: boolean;
    readonly trigger?: 'item' | 'axis';
    readonly format?: string | ((params: any) => string);
    readonly backgroundColor?: string | undefined;
    readonly borderColor?: string;
    readonly textColor?: string;
}
//# sourceMappingURL=config.d.ts.map