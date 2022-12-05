export interface IColumn {
    dataField: string,
    dataType: 'string' | 'number' | 'boolean' | 'date' | 'datetime',
    caption?: string,
    allowEditing?: boolean,

    allowAdding?: boolean,
    visible?: boolean,
    svamLookup?: {
        entityDataSource?: {
            entity: string
        },
        customDataSource?: {
            storedProcedure: {
                query?: string,
                params: { [key: string]: any }
            }
        }
        valueExpr?: 'value',
        displayExpr?: 'display',
    },
    editorOptions?: any
    validationRules?: ({ type: 'required', message: string })[],
    calculateDisplayValue?: string
}

