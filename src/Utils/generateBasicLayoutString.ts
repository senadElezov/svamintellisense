import { IControl } from '../Interfaces/IControl';


export const generateBasicLayoutString = (tableName: string, controls: IControl[], alterName: string = '') => {

    const layout =
`import { GroupItem } from 'devextreme/ui/form';

export const ${alterName || (tableName + 'Layout')}: GroupItem[] = [
    {
        itemType:'group',
        cssClass:'group-1',
        items:[
${controls.map(control => '\t\t\t{ itemType:\'simple\', dataField:\'' + control.dataField + '\'}').join(',\n')}            
        ]
    }
]`

    return layout;
}