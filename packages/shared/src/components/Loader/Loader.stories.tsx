import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Loader } from './Loader';
import { LoaderProps } from './Loader.types';

export default {
    title: 'Components/Loader',
    component: Loader,
} as Meta;

const Template: StoryFn<LoaderProps> = (args) => <Loader {...args} />;

export const Default = Template.bind({});
Default.args = {
    className: '',
    size: '16px', // default size with unit
    color: 'black',
};

export const Large = Template.bind({});
Large.args = {
    className: 'w-16 h-16',
    size: '32px', // large size with unit
    color: 'red',
};

export const xLarge = Template.bind({});
xLarge.args = {
    className: 'w-24 h-24',
    size: '64px', // x-large size with unit
    color: 'green',
};