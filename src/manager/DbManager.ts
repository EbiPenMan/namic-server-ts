import mongo, {Db, InsertOneWriteOpResult, MongoError, WriteOpResult} from "mongodb";
import {DB_NAME, DB_URL} from "../config/Configs";


export default class DbManager {
    private static instance: DbManager;
    // @ts-ignore
    private connectedDb: Db;
    // @ts-ignore

    private constructor() {
        console.log("[DbManager][constructor] - Start");
    }

    public static getInstance(): DbManager {
        if (!DbManager.instance) {
            DbManager.instance = new DbManager();
        }

        return DbManager.instance;
    }

    init() {
        console.log("[DbManager][init] - Called.");
        this.createOrConnectToDb();
    }

    dbIsConnected(): boolean {
        if (this.connectedDb == null)
            return false;
        return this.connectedDb.slaveOk;
    }

    getConnectedDb() : Db | null {
        if (this.connectedDb == null)
            return null;
        else if (this.connectedDb.slaveOk)
            return this.connectedDb;
        else
            return null;
    }

    createOrConnectToDb(onDone?: (db: Db) => any, OnError?: (error?: any) => any) {
        console.log("[DbManager][createOrConnectToDb] - Called.");

        const self = this;

        // @ts-ignore
        const _connectedDb: Db = this.getConnectedDb();

        return new Promise<Db>((resolve, reject) => {

            if (_connectedDb != null) {
                if (onDone)
                    onDone(_connectedDb);
                else
                    resolve(_connectedDb);
                return;
            }

            mongo.MongoClient.connect(DB_URL, {useUnifiedTopology: true})
                .then(function (db) {
                    console.log("[DbManager][createOrConnectToDb] - Database connected!");
                    let dbo: Db = db.db(DB_NAME);
                    self.connectedDb = dbo;
                    if (onDone)
                        onDone(dbo);
                    else
                        resolve(dbo);
                })
                .catch(
                    function (err) {
                        console.log("[DbManager][createOrConnectToDb] - error on connecting to db, error: ", err);
                        if (OnError)
                            OnError(err);
                        else
                            reject(err);
                    }
                );
        });
    }

    insertDocumentOne(collectionName:string, docObj:any, onDone?: (res:InsertOneWriteOpResult<any>) => any, OnError?: (error : MongoError) => any) : Promise<InsertOneWriteOpResult<any>> {

        const self = this;

        console.log("[DbManager][insertDocumentOne] - Called.");
        return new Promise<InsertOneWriteOpResult<any>>((resolve, reject) => {

            self.createOrConnectToDb()
                .then(function (db) {
                    db.collection(collectionName).insertOne(docObj, {}, function (errC, resC) {
                        if (errC) {
                            console.log("[DbManager][insertDocumentOne] - error on insert doc, error: ", errC);
                            if (OnError)
                                OnError(errC);
                            else
                                reject(errC);
                        } else {
                            console.log("[DbManager][insertDocumentOne] - 1 document inserted to " + collectionName);
                            if (onDone)
                                onDone(resC);
                            else
                                resolve(resC);
                        }
                    });

                })
                .catch(function (err) {
                    console.log("[DbManager][insertDocumentOne] - error on connecting to db, error: ", err);
                    if (OnError)
                        OnError(err);
                    else
                        reject(err);
                });
        });
    }

    foundDocument(collectionName:string, docFields:any, onDone?: (res:any[]) => any, OnError?: (error : MongoError) => any): Promise<any[]> {

        const self = this;

        console.log("[DbManager][foundDocument] - Called.");
        return new Promise<any[]>((resolve, reject) => {
            self.createOrConnectToDb(
                function (db) {
                    db.collection(collectionName).find(docFields).toArray(function (errC, resC ) {
                        console.log(`[DbManager][foundDocument] - found ${resC.length} document from ` + collectionName);
                        if (resC.length === 0) {
                            if (OnError)
                                OnError(errC);
                            else
                                reject(errC);
                        } else {
                            if (onDone)
                                onDone(resC);
                            else
                                resolve(resC);
                        }
                    });
                },
                function (err) {
                    console.log("[DbManager][foundDocument] - error on found doc, error: ", err);
                    if (OnError)
                        OnError(err);
                    else
                        reject(err);
                });
        });
    }

    foundDocumentById(collectionName:string, idStr:string, onDone?: (res:any) => any, OnError?: (error : MongoError) => any): Promise<any> {

        const self = this;

        console.log("[DbManager][foundDocumentById] - Called.");
        return new Promise<any>((resolve, reject) => {

            self.createOrConnectToDb()
                .then(function (db) {
                    const o_id = new mongo.ObjectID(idStr);
                    db.collection(collectionName).findOne({'_id': o_id}, function (errC, resC ) {
                        console.log(`[DbManager][foundDocumentById] - found ${JSON.stringify(resC)} document from ` + collectionName);
                        if (onDone)
                            onDone(resC);
                        else
                            resolve(resC);
                    });
                })
                .catch(function (err) {
                    console.log("[DbManager][foundDocumentById] - error on found doc, error: ", err);
                    if (OnError)
                        OnError(err);
                    else
                        reject(err);
                });
        });
    }

    updateDocument(collectionName:string, docFields:any, docObj:any, options?:any, onDone?: (res:WriteOpResult) => any, OnError?: (error : MongoError) => any): Promise<WriteOpResult> {

        const self = this;

        console.log("[DbManager][updateDocument] - Called.");
        return new Promise<WriteOpResult>((resolve, reject) => {

            self.createOrConnectToDb()
                .then(function (db) {
                    db.collection(collectionName).update(docFields, docObj, options, function (errC, resC) {
                        if (errC) {
                            console.log("[DbManager][updateDocument] - error on update doc, error: ", errC);
                            if (OnError)
                                OnError(errC);
                            else
                                reject(errC);
                        } else {
                            console.log("[DbManager][updateDocument] - 1 document updated  " + collectionName);
                            if (onDone)
                                onDone(resC);
                            else
                                resolve(resC);
                        }
                    });
                })
                .catch(function (err) {
                    console.log("[DbManager][updateDocument] - error on connecting to db, error: ", err);
                    if (OnError)
                        OnError(err);
                    else
                        reject(err);
                });
        });
    }

    removeDocument(collectionName:string, docFields:any, onDone?: (res:WriteOpResult) => any, OnError?: (error : MongoError) => any): Promise<WriteOpResult> {

        const self = this;

        console.log("[DbManager][removeDocument] - Called.");
        return new Promise<WriteOpResult>((resolve, reject) => {

            self.createOrConnectToDb()
                .then(function (db) {
                    db.collection(collectionName).remove(docFields, function (errC, resC) {
                        if (errC) {
                            console.log("[DbManager][removeDocument] - error on remove doc, error: ", errC);
                            if (OnError)
                                OnError(errC);
                            else
                                reject(errC);
                        } else {
                            console.log("[DbManager][removeDocument] - 1 document removed  " + collectionName);
                            if (onDone)
                                onDone(resC);
                            else
                                resolve(resC);
                        }
                    });
                })
                .catch(function (err) {
                    console.log("[DbManager][removeDocument] - error on connecting to db, error: ", err);
                    if (OnError)
                        OnError(err);
                    else
                        reject(err);
                });
        });
    }

};
