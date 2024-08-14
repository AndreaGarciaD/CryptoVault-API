module.exports = {
    stringToSah1(str){
        const crypto = require('crypto');
        const hash = crypto.createHash('sha1');
        hash.update(str);
        return hash.digest('hex');
    }
}