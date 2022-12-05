
 export const dataTypeToEditorType: { [key in 'string' | 'number' | 'boolean' | 'date' | 'datetime']: 'dxNumberBox' | 'dxSelectBox' | 'dxTextBox' | 'dxCheckBox' | 'dxDateBox' } = {
    boolean: 'dxCheckBox',
    date: 'dxDateBox',
    datetime: 'dxDateBox',
    number: 'dxNumberBox',
    string: 'dxTextBox'
}