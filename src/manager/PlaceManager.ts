import DbManager from "./DbManager";
import UserModule from "../module/UserModule";
import Packet from "../data/model/packet/Packet";

import {ERROR_DB_CREATE, ERROR_NOT_FOUND} from "../data/model/packet/PacketError";
import mongo, {ObjectId} from "mongodb";
import {PACKET_DATA_TYPES} from "../data/model/packet/PacketDataType";

export default class PlaceManager {
    private static instance: PlaceManager;
    private roleList: null;
    private placeList: null;
    private lawList: null;
    private placeProperties: { picUrl: null; name: null; _id: null };
    private constructor() {
        console.log("[PlaceManager][constructor] - Start");
        this.placeProperties = {
            _id: null,
            name: null,
            picUrl: null
        };

        this.roleList = null; // get separated
        this.placeList = null; // get separated
        this.lawList = null; // get separated
    }

    public static getInstance(): PlaceManager {
        if (!PlaceManager.instance) {
            PlaceManager.instance = new PlaceManager();
        }

        return PlaceManager.instance;
    }


    // TODO Get place with or without place parent
    // TODO Get role list
    // TODO Get place list
    // TODO Get law list

    onCreatePlace(packet:Packet, userM:UserModule) {
        const self = this;
        // packet.creatorId = userM.userProfile._id;
        this.createPlace(packet.data,
        ).then(function (res) {
            userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.PLACE_CREATE).setData({id: res.insertedId.toString()}).toString())
        }).catch(function (error) {
            userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.PLACE_CREATE).setError(ERROR_DB_CREATE("place")).toString());
        });
    }

    onGetPlace(packet:Packet, userM:UserModule) {
        const self = this;

        if (packet.data && packet.data.parentPlaceId) {
            this.getPlaceChild(packet.data.parentPlaceId)
                .then(function (res) {
                    userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.PLACE_GET).setData(res).toString())
                })
                .catch(function (error) {
                    userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.PLACE_GET).setError(ERROR_NOT_FOUND("place")).toString());
                });
        } else if (packet.data && packet.data.placeId) {
            this.getPlace(packet.data.placeId)
                .then(function (res) {
                    userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.PLACE_GET).setData(res).toString())
                })
                .catch(function (error) {
                    userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.PLACE_GET).setError(ERROR_NOT_FOUND("place")).toString());
                });
        } else {
            this.getGameRootPlace()
                .then(function (res) {
                    userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.PLACE_GET).setData(res).toString())
                })
                .catch(function (error) {
                    userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.PLACE_GET).setError(ERROR_NOT_FOUND("place")).toString());
                });
        }
    }

    onGetMyPlace(packet:Packet, userM:UserModule) {
        const self = this;
        this.getMyPlace(userM)
            .then(function (res) {
                userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.PLACE_GET_MY).setData(res).toString())
            })
            .catch(function (error) {
                userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.PLACE_GET_MY).setError(ERROR_NOT_FOUND("place")).toString());
            });

    }


    onJoinPlace(packet:Packet, userM:UserModule) {
        const self = this;

        if (packet.data.placeId) {
            const o_id = new mongo.ObjectID(packet.data.placeId);
            const docObj = {$addToSet: {userIdList: userM.userProfile._id.toString()}};
            // const docObj = {z: userM.userProfile._id.toString()};
            this.updatePlace(o_id, docObj)
                //TODO result
                .then(function (res) {
                    userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.PLACE_JOIN)
                        .setData({res : res }).toString())
                })
                .catch(function (error) {
                    userM.sendPacketToUser(new Packet().createResponse(packet)
                        .setError(ERROR_NOT_FOUND("userIdList")).toString());
                });
        } else {
            userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.PLACE_JOIN)
                .setError(ERROR_NOT_FOUND("place")).toString());
        }

    }

    onLeavePlace(packet:Packet, userM:UserModule) {
        const self = this;

        if (packet.data.placeId) {
            const o_id = new mongo.ObjectID(packet.data.placeId);
            const docObj = {$pull: {userIdList: userM.userProfile._id.toString()}};
            this.updatePlace(o_id, docObj)
                .then(function (res) {
                    //TODO result
                    userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.PLACE_LEAVE)
                        .setData({res : res }).toString())
                })
                .catch(function (error) {
                    userM.sendPacketToUser(new Packet().createResponse(packet)
                        .setError(ERROR_NOT_FOUND("userIdList")).toString());
                });
        } else {
            userM.sendPacketToUser(new Packet().createResponse(packet).setDataType(PACKET_DATA_TYPES.PLACE_LEAVE)
                .setError(ERROR_NOT_FOUND("place")).toString());
        }

    }


    getGameRootPlace() {
        return DbManager.getInstance().foundDocument("core-place",
            {
                $or: [
                    {parentPlaceId: {$exists: false}},
                    {parentPlaceId: null},
                    {parentPlaceId: ""}
                ]
            });
    }

    getMyPlace(userM:UserModule) {
        return DbManager.getInstance().foundDocument("core-place", {userIdList: userM.userProfile._id});
    }

    getPlace(placeId : string) {
        return DbManager.getInstance().foundDocumentById("core-place", placeId);
    }

    getPlaceChild(parentPlaceId: string) {
        return DbManager.getInstance().foundDocument("core-place", {parentPlaceId: parentPlaceId});
    }

    getRoleList(parentPlaceId: string) {
        return DbManager.getInstance().foundDocument("core-role", {parentPlaceId: parentPlaceId});
    }

    getLawList(parentPlaceId: string) {
        return DbManager.getInstance().foundDocument("core-law", {parentPlaceId: parentPlaceId});
    }


    createPlace(data : any): Promise<any>  {


        if (data.parentPlaceId == null || data.parentPlaceId === "") {
            // TODO must be admin for create game root place
            // return Promise.reject("dont have access.");
            return Promise.reject("forbidden");
        }

        //TODO run events

        // return EventManager.getInstance().runEvent(EVENT_NAMES.PLACE_CREATE, EVENT_ACTION_TYPE.BEFORE,
        //     data)
        //     .then(function (eventResult) {
        //         return DbManager.getInstance().insertDocumentOne(
        //             "core-place",
        //             eventResult.newData).then(EventManager.getInstance().runEvent(
        //             EVENT_NAMES.PLACE_CREATE, EVENT_ACTION_TYPE.BEFORE,
        //             data));
        //     })
        //     .catch(function (eventError) {
        //         return Promise.reject(eventError)
        //     });


    }

    updatePlace(placeId : ObjectId, docObj : any) {
        return DbManager.getInstance().updateDocument("core-place", {_id: placeId}, docObj);
    }

    deletePlace(placeId: ObjectId) {
        return DbManager.getInstance().removeDocument("core-place", {_id: placeId});
    }
}
