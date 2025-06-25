import type { ChartTheme } from '@/types';

export const lightTheme: ChartTheme = {
    backgroundColor: '#ffffff',
    textStyle: {
        color: '#333333',
    },
    color: [
        '#5470c6',
        '#91cc75',
        '#fac858',
        '#ee6666',
        '#73c0de',
        '#3ba272',
        '#fc8452',
        '#9a60b4',
        '#ea7ccc',
    ],
} as const;

export const darkTheme: ChartTheme = {
    backgroundColor: '#1f1f1f',
    textStyle: {
        color: '#ffffff',
    },
    title: {
        textStyle: {
            color: '#ffffff',
        },
    },
    legend: {
        textStyle: {
            color: '#ffffff',
        },
    },
    color: [
        '#5470c6',
        '#91cc75',
        '#fac858',
        '#ee6666',
        '#73c0de',
        '#3ba272',
        '#fc8452',
        '#9a60b4',
        '#ea7ccc',
    ],
} as const;