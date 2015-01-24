#!/usr/bin/env node

var sjl = require("./index.js");
var assert = require("assert");

var data;

sjl("not-found.conf", {"default": true})
.then(function(result)
{
    data = result;
    
    console.log('Loaded the following data: %s', JSON.stringify(data));

    assert.ok(data.default === true);
    
    
    return sjl("simple.json", {"default": true});
})
.then(function(result2)
{
    data = result2;

    console.log('Loaded the following data: %s', JSON.stringify(data));

    assert.ok(data.simple === true);


    console.log("--------------------------------");


    return sjl("not-found.conf", {"default": true}, {"silent": true});
})
.then(function(result3)
{
    data = result3;

    console.log('Loaded the following data: %s', JSON.stringify(data));

    assert.ok(data.default === true);
})
.catch(function(err)
{
    console.log(err.toString());

    assert.ok(false);
});
