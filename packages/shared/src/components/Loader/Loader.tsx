import React from 'react';
import './Loader.css';
import { LoaderProps } from './Loader.types';

export const Loader: React.FC<LoaderProps> = ({ className, color =  "#F54C00", size = '50px', speed = '1s' }) => {
    return (
        <div className={`loader`}>
            <div 
                className={`spinner ${className}`} 
                style={{
                    border: `4px solid rgba(0, 0, 0, 0.1)`,
                    borderWidth: '4px',
                    borderLeftColor: color,
                    width: size,
                    height: size,
                    animation: `spin ${speed} linear infinite`
                }}
            ></div>
        </div>
    );
};