
//const Log = require("../../../js/logger.js");
Module.register("MMM-Covid19ITA",{

    jsonData:null,

    defaults: {
        header: "Covid19-ITA",
        urlNation: "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale-latest.json",
        urlRegions: "https://github.com/pcm-dpc/COVID-19/blob/master/dati-json/dpc-covid19-ita-regioni-latest.json",
        animationSpeed: 3000,
        initialLoadDelay: 0,
        updateInterval: 1000 * 10, // 30 sec
        testUpdateInterval: 1000 * 30, //
        firstUpdate: true,
        statNames : ["Tot. Positive", "New Positive", "Tot. Recovered", "Tot. Dead"],
        //statisticsNation:[]
        //todayData: false,
    },

    /*
    getStyles: function (){
        return ["MMM-Covid19ITA.css"];
    },

     */


    /**
     * function called when the information on the screen needs to be updated. called by the updateDom() function
     */
    getDom: function () {
        //Log.info("entering Update Dop");
        //console.log("About to update Dom");

        var wrapper = document.createElement("div");
        //wrapper.innerHTML = this.config.text;
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = "300px";

        if (!this.jsonData) {
            wrapper.innerHTML = "Waiting for data... " + this.message;
            return wrapper;
        }
        //wrapper.innerText = this.message;
        //wrapper.innerText = this.jsonData[0].data;
        //wrapper.innerHTML = "Ciao";
        //wrapper.innerText = "Ciaone";


        var header = document.createElement("header");
        header.classList.add("small", "bright", "light", "header");
        header.innerHTML = this.config.header;
        wrapper.appendChild(header);

        var table = document.createElement("table");

        for (j = 0; j < 3; j++) {
            var row = document.createElement('tr');
            var nameCell = document.createElement('th');
            var totalCell = document.createElement('th');

            /*
            [nameCell, totalCell].forEach((td, i) => {
                td.className = 'small';
                if (i !== 0)
                    td.className += " bright align-right"
            })

             */

            nameCell.innerHTML = this.statNames[j];
            totalCell.innerHTML = this.statisticsNation[0];

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
        this.message = "Just started";
        //this.firstUpdate = true;
        //this.loaded = false; // will become true once i'm done processing my info
        //this.stats = [];
        this.getJson();
        this.scheduleUpdate();  // update now - can improve
        //this.scheduleTestUpdate()

        /*
        var self = this;
        setInterval(function () {
            self.updateDom();
        }, this.updateInterval) //update once every 10 min
         */

    },

    scheduleUpdate: function (delay){
        let self = this;
        setInterval(function (){
            self.getJson();
        }, this.config.updateInterval);
    },

    getJson: function (){
        this.sendSocketNotification("MMM-Covid19ITA_GET_JSON", this.config.urlNation);
    },

    socketNotificationReceived: function (notification, payload) {
        this.message = payload[0].data;
        if (notification === "MMM-Covid19ITA_JSON_RESULT") {
            // Only continue if the notification came from the request we made
            // This way we can load the module more than once
            if (payload.url === this.config.urlNation)
            {
                this.jsonData = payload.data;
                //this.message = this.jsonData[0].stato;
                this.processStats();
                this.updateDom(500);
            }
        }
    },

    getJSON : function (url, callback){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        //xhr.responseType = "json";
        xhr.onload = function (){
            this.message = "response arrived";
            var status = xhr.status;
            if(status === 200){
                callback(null, xhr.responseText);
            }else
                callback(status, xhr.responseText);
        }
        xhr.send();
        this.message = "request sent";
    },

    updateStats: function () {
        let regionURL = this.urlRegions;
        let nationURL = this.urlNation;
        //Log.info("about to ask for Json");
        this.message = "asking for JSON";

        this.getJSON(this.urlNation, function (err, data){
           if (err!= null){
               this.message = "something went wrong";
           }else {
               let stat = JSON.parse(data);
               this.message = "data received";
               this.scheduleUpdate(this.updateInterval);
               this.processStats(stat);
               this.updateDom(this.animationSpeed);
           }
        });
    },
    processStats: function (){
        this.statisticsNation[0] = this.jsonData[0].totale_positivi;
        this.statisticsNation[1] = this.jsonData[0].nuovi_positivi;
        this.statisticsNation[2] = this.jsonData[0].dimessi_guariti;
        this.statisticsNation[3] = this.jsonData[0].deceduti;
        this.message = "done processing stats";
        this.loaded = true;
    }
    });