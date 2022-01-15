import * as firestore from "./firestore/firestore";
import * as repository from "./firestore/repository";
import * as batch from "./firestore/batch";
import * as transformers from "./firestore/transformers";

export const setupResources = (db) => (entities) => {
  const makeDoc = firestore.docPathDb(db);
  const makeCollection = firestore.collectionPathDb(db);
  const dbRepo = repository.buildRepo(db);

  const assignedRepos = entities.reduce(
    (acc, x) => ({ ...acc, [x.name]: dbRepo(x) }),
    {}
  );

  return {
    batch: batch.setupBatch(db),
    makeRepo: dbRepo,
    makeDoc,
    makeCollection,
    persist: firestore.persist,
    repos: assignedRepos,
  };
};

export default {
  firestore,
  batch,
  repository,
  transformers,
  install: (
    app,
    {
      auth,
      onAuthStateChanged,
      router,
      // configAuth = { login: "login", logout: "logout" },
    }
  ) => {
    // const makeDoc = firestore.docPathDb(db);
    // const makeCollection = firestore.collectionPathDb(db);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // const uid = user.uid;
      } else {
        //
      }
    });

    router.beforeEach(() =>
      // to, from
      {
        // if (to.matched.some((record) => record.meta.authRequred)) {
        //   if (!rootUser) {
        //     next(login);
        //   } else {
        //     next();
        //   }
        // } else {
        //   next();
        // }
      }
    );

    // app.provide("db", {
    //   batch: batch.setupBatch(db),
    //   makeRepo: dbRepo,
    //   makeDoc,
    //   makeCollection,
    //   persist: firestore.persist,
    //   repos: assignedRepos,
    // });
  },
};
