// import { v4 as uuidv4 } from 'uuid';
const { v4: uuidv4 } = require('uuid');
import {MetricsManager_Interval_Main_MS} from "../config/Const";

export default class MetricsManager {
    private static instance: MetricsManager;
    private scheduler: NodeJS.Timeout | null;
    private registered_callbacks: any[];

    private constructor() {
        console.log("[MetricsManager][constructor] - Start");
        this.scheduler = null;
        this.registered_callbacks = [];
        this.startScheduler();
    }


    public static getInstance(): MetricsManager {
        if (!MetricsManager.instance) {
            MetricsManager.instance = new MetricsManager();
        }

        return MetricsManager.instance;
    }


    startScheduler() {

        const self = this;

        if (this.scheduler == null)
            this.scheduler = setInterval(function () {
                for (let i = 0; i < self.registered_callbacks.length; i++) {
                    self.registered_callbacks[i].callback.apply(
                        self.registered_callbacks[i].context,
                        self.registered_callbacks[i].paramsArray
                    );
                }
            }, MetricsManager_Interval_Main_MS)
    }

    stopScheduler() {
        if (this.scheduler != null)
            clearInterval(this.scheduler);
        this.scheduler = null;
    }

    registerMetric(context: any, paramsArray: any[] | null, callback: () => any) : string {

        let callbackObj: any = {};
        callbackObj.uuid = uuidv4();
        callbackObj.context = context;
        callbackObj.paramsArray = paramsArray;
        callbackObj.callback = callback;

        this.registered_callbacks.push(callbackObj);

        return callbackObj.uuid;
    }

    unRegisterMetric(uuid: string) {
        let foundedIndex = this.registered_callbacks.findIndex(x => x.uuid === uuid);
        if (foundedIndex !== -1)
            this.registered_callbacks.splice(foundedIndex, 1);
    }
};

