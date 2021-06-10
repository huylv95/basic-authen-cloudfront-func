function handler(event) {
    var request = event.request;
    var headers = request.headers;

    var authUser = 'lyfeuser';
    var authPass = '4,y:QB9Y';

    var authString = 'Basic ' + (authUser + ':' + authPass).toString('base64');
    if (typeof headers.authorization === 'undefined' || headers.authorization.value !== authString) {
        var response = {
            statusCode: 401,
            statusDescription: 'Unauthorized',
            headers: {
                'www-authenticate': {value: 'Basic'}
            }
        };
        return response;
    }

    return request;
}
