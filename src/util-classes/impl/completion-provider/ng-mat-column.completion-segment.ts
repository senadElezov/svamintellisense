import { ICompletionSegment } from '../../completion-provider/i-completion-segment';
import { IRemoteFieldPrimitiveDto } from '../../remote-groups/i-remote-field.dto';


export class NgMatColumnCompletionSegment implements ICompletionSegment {

    constructor() {

    }

    getCompletionSegment(params: Parameters<ICompletionSegment['getCompletionSegment']>['0']) {

        const { from } = params

        return `<asee-column dataField="${from.dataField}"}><asee-column>`
    };

    

}