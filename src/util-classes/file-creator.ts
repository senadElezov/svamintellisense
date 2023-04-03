


import { _ICreatorBase } from './creator.base';
import { FSManager } from './fs-manager';
import { ObjectUtils } from './object-utils';


export interface IFileCreator extends _ICreatorBase {

    suffix: string

    content: string

}


export class FileCreator implements IFileCreator {
    suffix!: string;
    content!: string;
    name!: string;
    path!: string;

    constructor(config: IFileCreator) {
        ObjectUtils.mapByKey(config, this);
    }

    create() {
        const { content, name, path, suffix } = this;

        return FSManager.createFile({
            content,
            name,
            path,
            suffix
        })
    }

}
