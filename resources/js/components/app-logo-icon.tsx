import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({
    className = '',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/logo-ditoekoe.svg"
            alt="Logo"
            className={`h-24 w-auto ${className}`}
            {...props}
        />
    );
}