import * as React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function MuiDatePicker({ onChange, label }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        slotProps={{ textField: { placeholder: '', fullWidth: true } }}
        onChange={onChange}
      />
    </LocalizationProvider>
  );
}