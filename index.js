var USERS = {
    protecteddir: [{
        username: 'user',
        password: 'pass',
    }],
};

//Response when auth is not valid.
var response401 = {
    statusCode: 401,
    statusDescription: 'Unauthorized',
    headers: {
        'www-authenticate': {value:'Basic'},
    },
};

var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function btoa(input) {
        input = String(input);
        var bitmap, a, b, c,
            result = "", i = 0,
            rest = input.length % 3; // To determine the final padding

        for (; i < input.length;) {
            if ((a = input.charCodeAt(i++)) > 255
                    || (b = input.charCodeAt(i++)) > 255
                    || (c = input.charCodeAt(i++)) > 255)
                throw new TypeError("Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.");

            bitmap = (a << 16) | (b << 8) | c;
            result += b64.charAt(bitmap >> 18 & 63) + b64.charAt(bitmap >> 12 & 63)
                    + b64.charAt(bitmap >> 6 & 63) + b64.charAt(bitmap & 63);
        }

        // If there's need of padding, replace the last 'A's with equal signs
        return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
    }

function handler(event) {
    var request = event.request;
    var headers = request.headers;
    
    var auth = request.headers.authorization && request.headers.authorization.value;

    var project = request.uri.substring(1).split(/\.|\//)[0];
    
    var users = USERS[project];
    
    if(users) {
        if(!auth || !auth.startsWith('Basic ')) {
            return response401;
        }
        
        if(!users.find(function(user) {
            
            // Construct the Basic Auth string
            var authString = 'Basic ' + btoa(user.username + ':' + user.password);
            
            return authString === auth;
        })) {
            return response401;
        }
    }
    return request;
}