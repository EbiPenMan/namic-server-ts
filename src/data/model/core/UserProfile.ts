import {ObjectId} from "bson";

export default class UserProfile {
    _id : ObjectId;
    mutableData : any;
    privateData: any;
    placeIdList: string[];
}
