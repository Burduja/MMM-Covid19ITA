var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
    start: function () {
        console.log('MMM-Covid19ITA helper startato...');
    },

    getJson: function (url) {
        var self = this;
        request({ url: url, method: 'GET' }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //var json = JSON.parse(body);
                // Send the json data back with the url to distinguish it on the receiving part
                self.sendSocketNotification("MMM-Covid19ITA_JSON_RESULT", {url: url, data: body});
            }
        });
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function (notification, url) {
        if (notification === "MMM-Covid19ITA_GET_JSON") {
            this.getJson(url);
        }
    }
});