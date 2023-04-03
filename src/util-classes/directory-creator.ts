import { _ICreatorBase } from './creator.base';
import { IFileCreator } from './file-creator';
import { FSManager } from './fs-manager';
import { ObjectUtils } from './object-utils';

export interface IDirectoryCreator extends _ICreatorBase {

    children?: (IDirectoryCreator | IFileCreator)[]

}


export class DirectoryCreator implements IDirectoryCreator {
    children?: (IDirectoryCreator | IFileCreator)[];
    name!: string;
    path!: string;

    constructor(config: IDirectoryCreator) {

        ObjectUtils.mapByKey(config, this)
    }

    async create() {
        const { name, path, children } = this;

        await FSManager.createDirectory({ name, path })

        const fullPath = path + '/' + name
        children?.forEach((child) => {
            child.path = fullPath;
            child.create()
        })

    }



}