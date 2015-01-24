'use strict';

var P            = require('bluebird');
var fs           = require('fs');
var utils        = require('util');
var EventEmitter = require('events').EventEmitter;


function Doc(contents)
{
    var self = this;
    
    if (contents)
    {
        for (var field in contents)
        {
            if (field)
            {
                self[field] = contents[field];
            }
        }
    }
}

utils.inherits(Doc, EventEmitter);


function silentLogFunction()
{}


module.exports = function(file, defaults, options)
{
    return new P(function(resolve, reject)
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
            fs.readFile(file, function(err, data)
            {
                if (err)
                {
                    log("Could not read file '%s'. %s", file, err);

                    if (defaults)
                    {
                        log("Using default values: '%s'", JSON.stringify(defaults));

                        result = new Doc(defaults);
                        
                        resolve(result);
                    }
                    else
                    {
                        reject(new Error("Could not read file and no default configuration provided"));
                    }
                }
                else
                {
                    result = JSON.parse(data.toString());

                    result = new Doc(result);
                    
                    resolve(result);

                    if (autoreload)
                    {
                        fs.watch(file, {persistent: false}, function(event)
                        {
                            if (event === 'change')
                            {
                                fs.readFile(file, {encoding: 'utf8'}, function(err2, newData)
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
                }
            });
        }
        else
        {
            reject(new Error("No file and/or no default configuration provided"));
        }
    });
};
