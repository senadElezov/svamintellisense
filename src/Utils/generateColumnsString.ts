import { IColumn } from "../Interfaces/IColumn";
import { IControl } from "../Interfaces/IControl";
import { ITableMeta } from "../Interfaces/ITableMeta";
import myStringify from "./myStringify";

const generateColumnsString = (tableName:string,columns:IColumn[]) => {
    const columnJson = myStringify(columns);

    const columnsString = '\nexport const ' + tableName + 'Columns:ISvamColumnOptions[] = ' + columnJson;

    return columnsString;
    
}

export default generateColumnsString;

