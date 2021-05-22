import DbManager from "./DbManager";
import UserModule from "../module/UserModule";
import Packet from "../data/model/packet/Packet";
import {EVENT_ACTION_TYPE, EVENT_NAMES} from "../data/enum/EventsEnums";
import {InsertOneWriteOpResult} from "mongodb";

export default class EventManager {
    private static instance: EventManager;
    private constructor() {
        console.log("[EventManager][constructor] - Start");
    }

    public static getInstance(): EventManager {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }

        return EventManager.instance;
    }

    runEvent(eventName:EVENT_NAMES,eventActionType : EVENT_ACTION_TYPE, data : any) : Promise<any> | PromiseLike<InsertOneWriteOpResult<any>> {
        console.log(`[EventManager] - [runEvent] - eventName: ${eventName} | actionType: ${eventActionType}`);

        return Promise.resolve(
            {
                newData: data,
                validate:
                    {
                        result: true,
                        reason: {
                            lawId: "123",
                            conditionId: "123",
                            message: ""
                        }
                    }
            }
        );

        // return Promise.reject(
        //     {
        //         newData: data,
        //         validate:
        //             {
        //                 result: true,
        //                 reason: {
        //                     lawId: "123",
        //                     conditionId: "123",
        //                     message: ""
        //                 }
        //             }
        //     }
        // );

    }

    onGetEvent(packet:Packet,userM:UserModule) {
        const self = this;

        // if (packet.data.parentEventId) {
        //     this.getEventChild(packet.data.parentEventId)
        //         .then(function (res) {
        //             userM.sendPacketToUser(new Packet().createResponse(packet).setType(PK_TYPES_SEND.PLACE_GET).setData(res).toString())
        //         })
        //         .catch(function (error) {
        //             userM.sendPacketToUser(new Packet().createResponse(packet).setType(PK_TYPES_SEND.PLACE_GET).setError(ERROR_NOT_FOUND("event")).toString());
        //         });
        // }
        // else if (packet.data.eventId) {
        //     this.getEvent(packet.data.eventId)
        //         .then(function (res) {
        //             userM.sendPacketToUser(new Packet().createResponse(packet).setType(PK_TYPES_SEND.PLACE_GET).setData(res).toString())
        //         })
        //         .catch(function (error) {
        //             userM.sendPacketToUser(new Packet().createResponse(packet).setType(PK_TYPES_SEND.PLACE_GET).setError(ERROR_NOT_FOUND("event")).toString());
        //         });
        // }
        // else {
        //     this.getGameRootEvent()
        //         .then(function (res) {
        //             userM.sendPacketToUser(new Packet().createResponse(packet).setType(PK_TYPES_SEND.PLACE_GET).setData(res).toString())
        //         })
        //         .catch(function (error) {
        //             userM.sendPacketToUser(new Packet().createResponse(packet).setType(PK_TYPES_SEND.PLACE_GET).setError(ERROR_NOT_FOUND("event")).toString());
        //         });
        // }
    }

    createEvent(data : any) {


        if (data.parentEventId == null || data.parentEventId === "") {
            // TODO must be admin for create game root event
            // return Promise.reject("dont have access.");
            return Promise.reject("forbidden");
        }

        //TODO run events

        // return this.runEvent(EVENT_NAMES.PLACE_CREATE,
        //     data)
        //     .then(function (eventResult) {
        //         return DbManager.getInstance().insertDocumentOne(
        //             "core-event",
        //             data);
        //     })
        //     .catch(function (eventError) {
        //         return Promise.reject(eventError)
        //     });


    }

    updateEvent(eventId: string, docObj : any) {
        return DbManager.getInstance().updateDocument("core-event", {_id: eventId}, docObj);
    }

    deleteEvent(eventId : string) {
        return DbManager.getInstance().removeDocument("core-event", {_id: eventId});
    }


}
