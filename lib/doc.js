
'use strict';


let utils        = require('util');
let EventEmitter = require('events').EventEmitter;


function Doc(contents)
{
    if (contents)
    {
        for (let field in contents)
        {
            if (field)
            {
                this[field] = contents[field];
            }
        }
    }
}

utils.inherits(Doc, EventEmitter);

module.exports =
{
    Doc: Doc
};
