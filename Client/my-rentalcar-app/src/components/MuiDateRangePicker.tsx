import { Grid } from "@mui/material"
import MuiDatePicker from '../components/MuiDatePicker';

import * as React from 'react';

export const MuiDateRangePicker = ({ onChangeStartDate, labelStartDate, errorMessageStartDate,
    onChangeEndDate, labelEndDate, errorMessageEndDate }) => {

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <MuiDatePicker onChange={onChangeStartDate} label={labelStartDate} />
                <span className="text-danger">{errorMessageStartDate}</span>
            </Grid>
            <Grid item xs={6}>
                <MuiDatePicker onChange={onChangeEndDate} label={labelEndDate} />
                <span className="text-danger">{errorMessageEndDate}</span>
            </Grid>
        </Grid>
    );
}
