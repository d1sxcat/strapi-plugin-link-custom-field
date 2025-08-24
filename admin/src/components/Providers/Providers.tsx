import { QueryClientProvider, QueryClient } from 'react-query';
import { forwardRef } from 'react';
import { Input } from '../Input';

export interface CustomFieldProps {
  attribute: {
    type: string;
    customField: string;
  };
  description: string;
  placeholder: string;
  hint: string;
  name: string;
  label: string;
  labelAction: any;
  onChange: (args: {
    target: {
      name: string;
      value: unknown;
      type: string;
    };
  }) => void;
  contentTypeUID: string;
  type: string; // custom field uid like plugin::color-picker.color
  value?: string;
  required: boolean;
  error: string;
  disabled: boolean;
  initialValue?: string;
}

const queryClient = new QueryClient();

export const LinkField = forwardRef<HTMLInputElement, CustomFieldProps>((props, ref) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Input ref={ref} {...props} />
    </QueryClientProvider>
  );
});
