#!/usr/bin/env node

var sjl    = require('./index.js');
var fs     = require('fs');
var assert = require('assert');

var data;

sjl('not-found.conf', {"default": true})
.then(function(result)
{
    data = result;
    
    console.log('Loaded the following data: %s', JSON.stringify(data));

    assert.ok(data.default === true);
    
    
    return sjl('simple.json', {"default": true});
})
.then(function(result2)
{
    data = result2;

    console.log('Loaded the following data: %s', JSON.stringify(data));

    assert.ok(data.simple === true);


    console.log("--------------------------------");


    return sjl('not-found.conf', {"default": true}, {"silent": true});
})
.then(function(result3)
{
    data = result3;

    console.log('Loaded the following data: %s', JSON.stringify(data));

    assert.ok(data.default === true);
    
    return sjl('simple.json', {"default": true}, {"autoreload": true});
})
.then(function(result4)
{
    data = result4;

    console.log('Loaded the following data: %s', JSON.stringify(data));

    assert.ok(data.simple === true);
    
    data.on('change', function(newData)
    {
        console.log('Loaded the following new data upon file changes: %s', JSON.stringify(newData));
        
        assert.ok(newData.simple === true);
        assert.ok(newData.autoreloaded === true);
    });
    
    data.on('error', function(err)
    {
        console.log('Could not auto-reload new data upon file changes: %s', err);
        
        assert.ok(false);
    });
    
    // Now we modify the file to trigger an auto-reload:
    fs.writeFileSync('simple.json', '{"simple": true, "autoreloaded": true}');
    
    setTimeout(function()
    {
        data.removeAllListeners();

        // Restore everything as it was before:
        fs.writeFileSync('simple.json', '{"simple": true}');
    }, 250);
})
.catch(function(err)
{
    console.log(err.toString());

    assert.ok(false);
});
