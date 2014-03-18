
var fs = require("fs");

module.exports = function(file, defaults, options)
{
    var silent = false;
    
    if (options)
    {
        silent = (options.silent === true);
    }
    
    
    var log = console.log;
    
    if (silent)
    {
        log = function(message){};
    }
    
    
    var result = undefined;
    
    if (file)
    {
        try
        {
            result = JSON.parse((fs.readFileSync(file)).toString());
        }
        catch (err)
        {
            log("Could not read file '%s'. %s", file, err);
            
            if (defaults)
            {
                log("Using default values: '%s'", JSON.stringify(defaults));

                result = defaults;
            }
            else
            {
                throw new Error("Could not read file and no default configuration provided");
            }
        }
    }
    else if (defaults)
    {
        log("No file provided. Using default values: '%s'", JSON.stringify(defaults));
                    
        result = defaults;
    }
    else
    {
        throw new Error("No file, nor default configuration provided");
    }
    
    return result;
};
