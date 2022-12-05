
export class Param {
    _name: string;
    _type: string;
    _isOutput:boolean;

    constructor(name: string, type: string,isOutput:boolean)
    {
        this._type = type;
        this._name = name; 
        this._isOutput = isOutput;
    }

}