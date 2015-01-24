sjl - Simple JSON Loader
===

This tool responds to a simple need: load an object from a file containing its JSON representation,
or use a default JSON document if that file is not found.

## Installation
```Bash
npm install sjl
```

## Usage
```Javascript
sjl(filePath, defaults, [options])
.then(...)
.catch(...);
```

An example:
```Javascript
var sjl = require('sjl');

sjl('simple.json', {})
.then(function(data)
{
    console.log('Loaded the following data: %s', JSON.stringify(data));
})
.catch(function(err)
{
    console.log(err.toString());
});
```

### Options
Two options are provided, `silent` and `autoreload`, both are booleans.  
The first one tells sjl whether or not to stay silent about files not being present and defaults being loaded instead.  
The second one triggers the _autoreload_ feature [see below].


## Reloading on file changes
When `autoreload` is set to `true` an event is thrown upon file contents changes,
making it possible to reload data automatically.  
This feature can be used like this:
```Javascript
sjl('simple.json', {}, {'autoreload': true})
.then(function(data)
{
    data.on('change', function(newData)
    {
        console.log('New data: %s', JSON.stringify(newData));
    });
    
    // Also generic errors are thrown:
    data.on('error', function(err)
    {
        console.log('Could not auto-reload. %s', err);
    });
});
```
