import * as vscode from 'vscode';
import { StringConstants } from '../StringConstants/StringConstants';

export class SvamTextLine 
{
    private _textLine: vscode.TextLine;
    private _arrayForTrimming: string[] = ["\n","\r","\t"];
    private _textLineText: string;

    constructor(textLine: vscode.TextLine) 
    {
        this._textLine = textLine;
        this._textLineText = textLine.text;
    }

    getText():string
    {
        return this._textLineText;
    }

    resetTextLine()
    {
        this._textLineText = this._textLine.text;
    
    }

    removeJS()
    {
        let lineText: string = this._textLineText;
        let newTextLineText: string = StringConstants.EMPTY; 
        
        let levelCounter = 0; 

        for(let charIndex: number = 0; charIndex < lineText.length; charIndex++ )
        {
            let currentChar: string = lineText.charAt(charIndex);
            
            switch (currentChar)
            {
                case StringConstants.JAVASCRIPT_STARTER:
                {
                    levelCounter++;

                }
                case StringConstants.JAVASCRIPT_ENDER:
                {
                    levelCounter--;
                    continue;
                }
            }
            
            if(levelCounter === 0)
            {
                newTextLineText = newTextLineText + currentChar;
            
            }
            
        }

        this._textLineText = newTextLineText;

    }

    removeStrings()
    {
        let newTextLineText = StringConstants.EMPTY;
        let stringStartedWith: string = StringConstants.EMPTY;
        let lineText: string = this._textLineText;

        let charIndex: number = 0;

        while(charIndex < lineText. length)
        {
            //Is it a string starter
            let currentChar: string = lineText.charAt(charIndex);
            if (currentChar === StringConstants.STRING_ENCAPSULATOR || currentChar === StringConstants.STRING_ALT_ENCAPSULATOR)
            {
                stringStartedWith = currentChar;
                charIndex++;
                currentChar = lineText.charAt(charIndex);

                while(charIndex < lineText.length-1 && currentChar !== stringStartedWith)
                {
                    charIndex++;
                    currentChar = lineText.charAt(charIndex);

                }

                charIndex++;
                currentChar = lineText.charAt(charIndex);
            }

            newTextLineText = newTextLineText + currentChar; 
            charIndex++;
        }
        this._textLineText = newTextLineText;
        
        return newTextLineText;
    }

    trim()
    {
        let newTextLineText: string = StringConstants.EMPTY;
        let lineText: string = this._textLineText;

        newTextLineText = this.removeCharsFromAString(lineText, this._arrayForTrimming);

        this._textLineText = newTextLineText;
    }

    trimRemoveJSRemoveStrings()
    {
        this.trim();
        this.removeJS();
        this.removeStrings();

    }
    private removeCharsFromAString(startingString:string, charsArray: string[]): string
    {
        charsArray.map((character)=>
        { 
            let re = new RegExp(character, "g");
            startingString=startingString.replace(re,"");
        });

        return startingString;
    }
}