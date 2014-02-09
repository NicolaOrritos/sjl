
var fs = require("fs");

module.exports = function(file, defaults)
{
    var result = undefined;
    
    if (file)
    {
        try
        {
            result = JSON.parse((fs.readFileSync(file)).toString());
        }
        catch (err)
        {
            console.log("Could not read file '%s'. %s", file, err);
            
            if (defaults)
            {
                console.log("Using default values: '%s'", JSON.stringify(defaults));

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
        console.log("No file provided. Using default values: '%s'", JSON.stringify(defaults));
                    
        result = defaults;
    }
    else
    {
        throw new Error("No file, nor default configuration provided");
    }
    
    return result;
};
