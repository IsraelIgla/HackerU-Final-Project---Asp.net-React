import React from 'react'
import { Stack, Autocomplete, TextField } from "@mui/material"
import { useState } from "react"

type Option = {
    id: number,
    text: string
}

export const MuiAutocomplete = ({ options, label, onChange }) => {
    const [text, setText] = useState<String | null>(null)
    const [option, setOption] = useState<Option | null>(null)
    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option.text}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label={label} />}
            value={option}
            fullWidth={true}
            onChange={(event: any, newOption: Option | null) => { setOption(newOption); onChange(newOption) }}
            onInputChange={(event: any, newText: string | null) => { setText(newText) }}
        />
    )
}