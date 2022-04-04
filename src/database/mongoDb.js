import dotenv from "dotenv";
dotenv.config();

import { MongoClient, ObjectId } from "mongodb";
const mongoOpen = MongoClient.connect(`${process.env.URL_MONGO}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((dbMongo) => {
  console.log("Mongo conectado!");
  return dbMongo.db(process.env.DB_MONGO);
});

const find = async (collection, query) =>
  new Promise((resolve, rejects) => {
    mongoOpen
      .then((dbMongo) => {
        dbMongo
          .collection(collection)
          .find(query ? query : {})
          .limit(100)
          .toArray()
          .then((result) => {
            resolve(result);
          })
          .catch(async (error) => {
            rejects(error);
          });
      })
      .catch(console.warn);
  });

const findOne = async (collection, query) =>
  new Promise((resolve, rejects) => {
    mongoOpen
      .then((dbMongo) => {
        dbMongo
          .collection(collection)
          .find(query)
          .sort({ _id: -1 })
          .limit(1)
          .toArray()
          .then((result) => {
            resolve(result);
          })
          .catch(async (error) => {
            rejects(error);
          });
      })
      .catch(console.warn);
  });

const insertOne = async (collection, dados) =>
  new Promise((resolve, rejects) => {
    mongoOpen
      .then((dbMongo) => {
        dbMongo
          .collection(collection)
          .insertOne(dados)
          .then(async (result) => {
            resolve(result);
          })
          .catch(async (error) => {
            rejects(error);
          });
      })
      .catch(console.warn);
  });

const update = async (collection, query, dados) =>
  new Promise((resolve, rejects) => {
    mongoOpen
      .then((dbMongo) => {
        dbMongo
          .collection(collection)
          .updateOne(query, dados)
          .then((result) => {
            if (result.modifiedCount > 0) {
              console.log(`${collection} atualizou com sucesso`);
            }
            resolve(result);
          })
          .catch(async (error) => {
            console.log(error);
            rejects(error);
          });
      })
      .catch(console.warn);
  });

const deleteOne = async (collection, query) =>
  new Promise((resolve, rejects) => {
    mongoOpen
      .then((dbMongo) => {
        dbMongo
          .collection(collection)
          .deleteOne(query)
          .then((result) => {
            resolve(result);
          })
          .catch(async (error) => {
            console.log(error);
            rejects(error);
          });
      })
      .catch(console.warn);
  });

export default { insertOne, find, update, findOne, deleteOne };
