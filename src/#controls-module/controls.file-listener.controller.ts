import { Disposable } from 'vscode';
import { ControlsFileListener } from './controls.file-listener';


export class ControlsFileListenerController implements Disposable {


    readonly controlsFileListener = new ControlsFileListener();
    constructor() {

        this.controlsFileListener.initializeListeners();
    }

    dispose() {
        this.controlsFileListener.disposables.forEach((disp) => disp.dispose())
    }

}