Module.register("MMM-Covid19ITA",{
    defaults: {
        //default variables
        header: "Covid19 - ITA",
        urlNation: "https://github.com/pcm-dpc/COVID-19/blob/master/dati-json/dpc-covid19-ita-andamento-nazionale-latest.json",
        urlRegions: "https://github.com/pcm-dpc/COVID-19/blob/master/dati-json/dpc-covid19-ita-regioni-latest.json",
        animationSpeed: 3000,
        initialLoadDelay: 0,
        updateInterval: 1000 * 10 * 60, // 10 minutes
        firstUpdate: true,
        statNames : ["Tot. Positive", "New Positive", "Tot. Recovered", "Tot. Dead"],
        statisticsNation:[]
        //todayData: false,

    },

    /*
    getStyles: function (){
        return ["MMM-Covid19ITA.css"];
    },

     */

    getParsedJSONFromURL : function (url, callback) {
        console.log("Entering ajaxGet...");
        callback = (typeof callback == 'function' ? callback : false), xhr = null;
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        xhr = new XMLHttpRequest();
        if (!xhr)
            return null;
        xhr.open("GET", urlNation,true);
        xhr.onreadystatechange=function() {
            if (xhr.readyState===4 && callback) {
                console.log("all ok")
                callback(xhr.responseText)
            }
        }
        xhr.send(null);
        return xhr;
    },
    /**
     * function called when the information on the screen needs to be updated. called by the updateDom() function
     */
    getDom: function (){
        console.log("About to update Dom");
        var wrapper = document.createElement("div");
        //wrapper.innerHTML = this.config.text;
        if (!this.loaded) {
            wrapper.innerHTML = this.translate('LOADING');
            return wrapper;
        }
        var table = document.createElement("table");
        for (j = 0; j < 3; j++) {
            var row = document.createElement('tr');
            var nameCell = document.createElement('td');
            var totalCell = document.createElement('td');

            [nameCell, totalCell].forEach((td, i) => {
                td.className = 'small';
                if (i !== 0)
                    td.className += " bright align-right"
            })
            nameCell.innerHTML = this.statNames[j];
            totalCell.innerHTML = statisticsNation[0];

            row.appendChild(nameCell);
            row.appendChild(totalCell);

            table.appendChild(row);
        }

        wrapper.appendChild(table);
        return wrapper;
    },
    /**
     * function called when all modules are loaded and the system is ready to boot up
     */
    start: function () {
        console.log("Starting...")
        this.firstUpdate = true;
        this.loaded = false; // will become true once i'm done processing my info
        this.scheduleUpdate( this.config.initialLoadDelay);  // update now - can improve
        /*
        var self = this;
        setInterval(function () {
            self.updateDom();
        }, this.updateInterval) //update once every 10 min

         */
    },

    scheduleUpdate: function (delay){
        let nextLoad;
        if(typeof delay !== "undefined" && delay >= 0){
            nextLoad = delay;
        }

        let self = this;
        setTimeout(function (){
            self.updateStats();
        }, nextLoad);
    },


    updateStats: function () {
        let regionURL = this.urlRegions;
        let nationURL = this.urlNation;
        this.getParsedJSONFromURL(nationURL, function (response) {
            let data = JSON.parse(response);
            if (!response)
                return;
            if (!data)
                return;
            console.log("Data received");
            this.scheduleUpdate(this.updateInterval);
            this.processStats(data);
            updateDom();
        })
    },


    processStats: function (data){
        this.statisticsNation[0] = data[0].totale_positivi;
        this.statisticsNation[1] = data[0].nuovi_positivi;
        this.statisticsNation[2] = data[0].dimessi_guariti;
        this.statisticsNation[3] = data[0].deceduti;
    }
    });