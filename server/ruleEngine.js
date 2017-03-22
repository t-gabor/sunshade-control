const NodeRules = require("node-rules");

const windSpeedRuleHigh = {
    condition: function(R) {
        R.when(this.windSpeed > 25);
    },
    consequence: function(R) {
        this.event = "control:close";
        R.stop();
    },
    priority: 5
};

const windSpeedRuleLow = {
    condition: function(R) {
        R.when(this.windSpeed < 15);
    },
    consequence: function(R) {
        this.event = "control:open";
        R.next();
    },
    priority: 1
};

const precipIntensityRule = {
    condition: function(R) {
        R.when(this.precipIntensity > 0);
    },
    consequence: function(R) {
        this.event = "control:close";
        R.stop();
    },
    priority: 5
};

const weatherCodeRule = {
    condition: function(R) {
        R.when(!["clear", "mostlysunny", "partlycloudy", "sunny"].includes(this.weatherCode));
    },
    consequence: function(R) {
        this.event = "control:close";
        R.stop();
    },
    priority: 5
};


const defaultRules = [
    windSpeedRuleLow,
    windSpeedRuleHigh,
    precipIntensityRule,
    weatherCodeRule
];

function ruleEngine(emitter, getWeather) {

    let rules = defaultRules;

    function processWeather(error, weather) {
        if (error) {
            return;
        }

        new NodeRules(rules).execute(weather, (result) => {
            if (result && result.event) {
                emitter.emit(result.event);
            }
        });
    }

    emitter.on("control:update", () => {
        getWeather(processWeather);
    });

    return {
        replaceRules: (r) => {
            rules = r;
        }
    };
}

module.exports = ruleEngine;
