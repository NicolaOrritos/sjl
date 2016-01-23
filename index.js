
'use strict';


function silentLogFunction()
{}

function emptyCallback()
{}

let log;

let backends = [];

function loadBackends()
{
    // TODO
    throw new Error('Not implemented yet');
}

loadBackends();

function selectBackend(file)
{
    let result;

    for (let backend of backends)
    {
        if (backend && backend.name && backend.protocol && backend.process)
        {
            log('Evaluating backend "%s", which has protocol "%s"...', backend.name, backend.protocol);

            let protocolStart  = 0;
            let protocolEnd    = file.indexOf('://');
            let sourceProtocol = file.slice(protocolStart, protocolEnd);

            log('Given source protocol is "%s"', sourceProtocol);

            if (   sourceProtocol         === backend.protocol
                || sourceProtocol + '://' === backend.protocol)
            {
                result = backend;
            }
        }
        else
        {
            log('Skipping malformed backend "%s"...', JSON.stringify(backend));
        }
    }

    log('Selected backend is: "%s"', result);

    return result;
}


module.exports = function(file, defaults, options, callback)
{
    callback = callback || emptyCallback;

    return new Promise( (resolve, reject) =>
    {
        let silent     = false;
        let autoreload = false;

        if (options)
        {
            silent     = (options.silent     === true);
            autoreload = (options.autoreload === true);
        }

        log = silent ? silentLogFunction : console.log;

        file = file.trim();

        // Find a suitable backend based on protocol:
        let selectedBackend = selectBackend(file);

        if (selectedBackend)
        {
            selectedBackend
            .process(file, defaults, autoreload, log)
            .then(function(result)
            {
                resolve(result);

                callback(null, result);
            })
            .catch(function(err)
            {
                reject(err);

                callback(err);
            });
        }
    });
};
