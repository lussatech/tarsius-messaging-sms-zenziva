'use strict';

/**
 * Zenziva SMS Services
 */


var Promise  = require('bluebird'),
    rp       = require('request-promise'),
    libxmljs = require("libxmljs");

var Zenziva = function(configs){
    this._api = 'https://alpha.zenziva.net/apps/smsapi.php';

    this.store = configs.store;
    this.userkey = configs.userkey;
    this.passkey = configs.passkey;
};

Zenziva.prototype.send = function(number, message){
    var self = this;
    /**
     * [response_handler description]
     * @param  {Object} response [description]
     * @return {Void}          [description]
     */
    function response_handler(xml){
        var status = xml.get('//status'),
            text = xml.get('//text');
        if(!status)
            throw 'error parsing xml';
        if(parseInt(status.text(),10) !== 0)
            throw text.text();
        // its ok
        return true;
    }

    // send sms
    var params = {
            userkey : self.userkey,
            passkey : self.passkey,
            nohp : number,
            pesan : message
        };
    var params_array = [];
    _.each(params, function(value, key){
        params_array.push(key+'='+value);
    });
    return rp(self._api+'?'+params_array.join('&'))
    .then(function(body){
        var xml = libxmljs.parseXml(body);
        return response_handler(xml);
    });
};

module.exports = function(configs) {
    return new Zenziva(configs);
};
