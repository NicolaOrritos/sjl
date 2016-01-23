
'use strict';

let fs  = require('fs');
let Doc = require('../lib/doc.js').Doc;

module.exports =
{
    name: 'File',

    protocol: 'file://',

    process: function(file, defaults, autoreload, log)
    {
        return new Promise(function(resolve, reject)
        {
            if (file)
            {
                fs.readFile(file, (err, data) =>
                {
                    let result;

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
                            let error = new Error("Could not read file and no default configuration provided");

                            reject(error);
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
                    }
                });
            }
            else
            {
                let error = new Error("No file and/or no default configuration provided");

                reject(error);
            }
        });
    }
};
