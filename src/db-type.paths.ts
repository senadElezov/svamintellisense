import { DBType } from './Types/db-type';

export interface IPath {
    repositoryFolderPath: string
}

export const dbTypePaths: { [dbType in DBType]: IPath } = {
    oo: {
        repositoryFolderPath: 'app/repository/oo'
    },
    op: {
        repositoryFolderPath: 'app/repository/op'
    }
}