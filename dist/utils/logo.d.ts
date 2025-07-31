import type { ChartLogo } from '@/types';
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
export declare const calculateLogoPosition: (logo: ChartLogo, chartWidth: number, chartHeight: number) => {
    x: number;
    y: number;
};
export declare const createLogoGraphic: (logo: ChartLogo, chartWidth: number, chartHeight: number) => LogoGraphicOption;
export declare const addLogoToOption: (option: any, logo: ChartLogo, chartWidth: number, chartHeight: number) => any;
export declare const removeLogoFromOption: (option: any) => any;
//# sourceMappingURL=logo.d.ts.map