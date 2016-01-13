'use strict';

var fs           = require('fs');
var utils        = require('util');
var EventEmitter = require('events').EventEmitter;


function Doc(contents)
{
    if (contents)
    {
        for (var field in contents)
        {
            if (field)
            {
                this[field] = contents[field];
            }
        }
    }
}

utils.inherits(Doc, EventEmitter);


function silentLogFunction()
{}

function emptyCallback()
{}


module.exports = function(file, defaults, options, callback)
{
    callback = callback || emptyCallback;

    return new Promise((resolve, reject) =>
    {
        var result;
        var silent     = false;
        var autoreload = false;

        if (options)
        {
            silent     = (options.silent     === true);
            autoreload = (options.autoreload === true);
        }

        var log = silent ? silentLogFunction : console.log;


        if (file)
        {
            fs.readFile(file, (err, data) =>
            {
                if (err)
                {
                    log("Could not read file '%s'. %s", file, err);

                    if (defaults)
                    {
                        log("Using default values: '%s'", JSON.stringify(defaults));

                        result = new Doc(defaults);

                        resolve(result);

                        callback(null, result);
                    }
                    else
                    {
                        var error = new Error("Could not read file and no default configuration provided");

                        reject(error);

                        callback(error);
                    }
                }
                else
                {
                    result = JSON.parse(data.toString());

                    result = new Doc(result);

                    resolve(result);

                    if (autoreload)
                    {
                        fs.watch(file, {persistent: false}, event =>
                        {
                            if (event === 'change')
                            {
                                fs.readFile(file, {encoding: 'utf8'}, (err2, newData) =>
                                {
                                    if (err2)
                                    {
                                        result.emit('error', err2);
                                    }
                                    else
                                    {
                                        newData = new Doc(JSON.parse(newData));

                                        result.emit('change', newData);
                                    }
                                });
                            }
                        });
                    }

                    callback(null, result);
                }
            });
        }
        else
        {
            var error = new Error("No file and/or no default configuration provided");

            reject(error);

            callback(error);
        }
    });
};
