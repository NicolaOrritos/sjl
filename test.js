#!/usr/bin/env node

'use strict';

let sjl    = require('./index.js');
let fs     = require('fs');
let assert = require('assert');

let data;

sjl('not-found.conf', {"default": true})
.then( result =>
{
    data = result;

    console.log('Loaded the following data: %s', JSON.stringify(data));

    assert.ok(data.default === true);


    return sjl('simple.json', {"default": true});
})
.then( result2 =>
{
    data = result2;

    console.log('Loaded the following data: %s', JSON.stringify(data));

    assert.ok(data.simple  === true);
    assert.ok(data.default === false);


    console.log("--------------------------------");


    return sjl('not-found.conf', {"default": true}, {"silent": true});
})
.then( result3 =>
{
    data = result3;

    console.log('Loaded the following data: %s', JSON.stringify(data));

    assert.ok(data.default === true);
    assert.ok(data.simple  === undefined);

    return sjl('simple.json', {"default": true}, {"autoreload": true});
})
.then( result4 =>
{
    data = result4;

    console.log('Loaded the following data: %s', JSON.stringify(data));

    assert.ok(data.simple  === true);
    assert.ok(data.default === false);

    data.on('change', newData =>
    {
        console.log('Loaded the following new data upon file changes: %s', JSON.stringify(newData));

        assert.ok(newData.simple === true);
        assert.ok(newData.autoreloaded === true);
    });

    data.on('error',  err =>
    {
        console.log('Could not auto-reload new data upon file changes: %s', err);

        assert.ok(false);
    });

    // Now we modify the file to trigger an auto-reload:
    fs.writeFileSync('simple.json', '{"simple": true, "default": false, "autoreloaded": true}');

    setTimeout( () =>
    {
        data.removeAllListeners();

        // Restore everything as it was before:
        fs.writeFileSync('simple.json', '{"simple": true, "default": false}');

    }, 250);
})
.catch( err =>
{
    console.log(err.toString());

    assert.ok(false);
});
