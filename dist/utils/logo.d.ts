import type { ChartLogo } from '@/types';
/**
 * Logo graphic option for ECharts
 */
export interface LogoGraphicOption {
    type: 'image';
    style: {
        image: string;
        x: number;
        y: number;
        width: number;
        height: number;
        opacity?: number;
    };
    z?: number;
    silent?: boolean;
}
/**
 * Chart option with optional graphic property
 * Using Record<string, any> for flexibility with ECharts' complex type system
 */
type ChartOptionWithGraphic = Record<string, any>;
export declare const calculateLogoPosition: (logo: ChartLogo, chartWidth: number, chartHeight: number) => {
    x: number;
    y: number;
};
export declare const createLogoGraphic: (logo: ChartLogo, chartWidth: number, chartHeight: number) => LogoGraphicOption;
export declare const addLogoToOption: <T extends ChartOptionWithGraphic>(option: T, logo: ChartLogo, chartWidth: number, chartHeight: number) => T;
export declare const removeLogoFromOption: <T extends ChartOptionWithGraphic>(option: T) => T;
export {};
//# sourceMappingURL=logo.d.ts.map