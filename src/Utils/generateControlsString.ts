import { IControl } from "../Interfaces/IControl";
import { ITableMeta } from "../Interfaces/ITableMeta";
import myStringify from "./myStringify";

const generateControlsString = (tableName: string, controls: IControl[], alterName: string = '') => {
    let returningControlsString = '\nexport const ' + (alterName || (tableName + 'Controls')) + ' = [\n'

    controls.map(control => {
        returningControlsString += myStringify(control) + ' as IEditorProps<\'' + control.editorType + '\'>,\n';

    })

    returningControlsString += '\n];'

    return returningControlsString;
}

export default generateControlsString;
