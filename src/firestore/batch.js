import { writeBatch } from "firebase/firestore";
import { pipe } from "fp-utilities";

export const setupBatch = (db) => () => {
  let batchInstance = writeBatch(db);
  let defaultHandlers = [];

  const commitBatch = async ({ batch, handlers = [] } = {}) => {
    let results;
    try {
      results = await batch
        .commit()
        .then(() => {
          handlers.forEach((x) => {
            x();
          });
          return true;
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
      return false;
    }
    return results;
  };

  const insert = (path, doc, handler = () => {}) => {
    batchInstance.set(path, doc, { merge: true });
    defaultHandlers.push(handler);
  };

  const update = (path, doc, handler = () => {}) => {
    batchInstance.update(path, doc);
    defaultHandlers.push(handler);
  };

  const remove = (path, handler = () => {}) => {
    batchInstance.delete(path);
    defaultHandlers.push(handler);
  };

  return (commands) => {
    pipe(...commands)({
      insert,
      remove,
      update,
    });

    return async () =>
      await commitBatch({ batch: batchInstance, handlers: defaultHandlers });
  };
};
