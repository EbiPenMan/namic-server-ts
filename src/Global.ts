import MetricsManager from "./manager/MetricsManager";

export default class Global {
    private static instance: Global;


    private constructor() {
        console.log("[Global][constructor] - Start");
    }

    public static getInstance(): Global {
        if (!Global.instance) {
            Global.instance = new Global();
        }

        return Global.instance;
    }

};

