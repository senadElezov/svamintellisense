
export interface IControl {
    editorType: 'dxNumberBox' | 'dxSelectBox' | 'dxTextBox' | 'dxCheckBox' | 'dxDateBox' | 'dxTextArea',
    dataField: string,
    svamEditorOptions?: {
        entityDataSource: {
            entity: string,
            referencedInArray?: {
                type: 'in'

                referencedColumn: string,

                referencedTable: string,
            }[]
        },
        storedProcedure?: {
            query: string,
            params: { [key: string]: any }
        }
    },
    formLabel?: {
        text: string
    },
    editorOptions?: {
        visible?: boolean,
        readOnly?: boolean,
        valueExpr?: 'value',
        displayExpr?: 'display',
        type?: string
    },
    validationRules?: ({ type: 'required', message: string })[]
}

