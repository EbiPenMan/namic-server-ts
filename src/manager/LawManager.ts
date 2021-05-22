import DbManager from "./DbManager";

export default class LawManager {
    private static instance: LawManager;
    private constructor() {
        console.log("[LawManager][constructor] - Start");
    }

    public static getInstance(): LawManager {
        if (!LawManager.instance) {
            LawManager.instance = new LawManager();
        }

        return LawManager.instance;
    }


    getLaw(lawId: string) {
        return DbManager.getInstance().foundDocumentById("law", lawId);
    }

    // get - remove all laws by placeId

    createLaw(parentPlaceId: any, name: any, des: any, eventIdList: any, conditionIdList: any) {

        let docObj = {parentPlaceId : parentPlaceId ,
            name: name,
            des: des,
            eventIdList: eventIdList,
            conditionIdList: conditionIdList
        };

        return DbManager.getInstance().insertDocumentOne(
            "law",
            docObj);

    }

    updateLaw(lawId: any, docObj: any) {
        return DbManager.getInstance().updateDocument("law", {_id: lawId}, docObj);
    }

    deleteLaw(lawId: any) {
        return DbManager.getInstance().removeDocument("law", {_id: lawId});
    }
}
