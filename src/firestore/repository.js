import { doc, where } from "firebase/firestore";
import { docPathDb, collectionPathDb } from "./firestore";
import { sanitizeDoc } from "./sanitizeDoc";
import { pipe } from "utilities";

export const buildRepo =
  (db) =>
  (resource) =>
  (baseParts = []) => {
    let basePath = resource.basePath(baseParts);
    let docPath = docPathDb(db)(basePath);
    let collectionPath = collectionPathDb(db)(basePath, resource.grouped);

    const filterBy = (property, value, operator = "==") =>
      where(property, operator, value);

    const all =
      ({
        transformer = resource.baseTransformer,
        handler = resource.handlers.insert,
      } = {}) =>
      (persist) => {
        return persist.all(collectionPath(transformer), handler);
      };

    const find =
      ({
        filters = [],
        transformer = resource.baseTransformer,
        handler = resource.handlers.insert,
      } = {}) =>
      (persist) => {
        let collectedFilters = filters.map((x) =>
          filterBy(x.property, x.value, x.operator)
        );
        return persist.find(
          collectionPath(transformer),
          collectedFilters,
          handler
        );
      };

    const findById =
      (
        id,
        {
          transformer = resource.baseTransformer,
          handler = resource.handlers.insert,
        } = {}
      ) =>
      (persist) => {
        return persist.findById(docPath(id)(transformer), handler);
      };

    const insert =
      (
        id,
        doc,
        {
          transformer: transformer = resource.baseTransformer,
          handler: handler = resource.handlers.insert,
        } = {}
      ) =>
      (persist) => {
        let cleanDoc = transformer.to
          ? pipe(...transformer.to)(sanitizeDoc(doc))
          : sanitizeDoc(doc);

        let returnDoc = transformer.from
          ? pipe(...transformer.from)(cleanDoc)
          : cleanDoc;

        persist.insert(docPath(id)(), cleanDoc, handler(returnDoc));
        return persist;
      };

    const update =
      (
        id,
        doc,
        {
          transformer: transformer = resource.baseTransformer,
          handler: handler = resource.handlers.update,
        } = {}
      ) =>
      (persist) => {
        let cleanDoc = transformer.to
          ? pipe(...transformer.to)(sanitizeDoc(doc))
          : sanitizeDoc(doc);

        let returnDoc = transformer.from
          ? pipe(...transformer.from)(cleanDoc)
          : cleanDoc;

        persist.update(docPath(id)(), cleanDoc, handler(returnDoc));
        return persist;
      };

    const remove =
      (removedDoc, { handler: handler = resource.handlers.remove } = {}) =>
      (persist) => {
        console.log(persist);
        persist.remove(
          doc(db, ...basePath, removedDoc.id),
          handler(removedDoc)
        );

        return persist;
      };

    return {
      all,
      docPath,
      collectionPath,
      find,
      findById,
      insert,
      update,
      remove,
    };
  };

// const Batcher = (x) => ({
//   map: (f) => Batcher(f(x)),
// });

// const task = Batcher(batch).map(insert());
