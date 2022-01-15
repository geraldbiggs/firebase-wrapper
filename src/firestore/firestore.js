import {
  collection,
  collectionGroup,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { buildTransformer } from "./transformers";

export const docPathDb = (db) => (path) => (id) => (transformer) => {
  return doc(db, ...[...path, id]).withConverter(buildTransformer(transformer));
};

export const collectionPathDb =
  (db) =>
  (path, grouped = false) =>
  (transformer) =>
    grouped
      ? collectionGroup(db, ...path).withConverter(
          buildTransformer(transformer)
        )
      : collection(db, ...path).withConverter(buildTransformer(transformer));

export const normalizeSnapshot = (doc) => {
  return doc.data();
};

export const all = async (path, handler = (x) => x) => {
  const querySnapshot = await getDocs(path);
  return handler(querySnapshot.docs.map(normalizeSnapshot))();
};

export const findById = async (path, handler = (x) => x) => {
  const docSnap = await getDoc(path);

  if (docSnap.exists()) {
    return handler(docSnap.data())();
  } else {
    return false;
  }
};

export const filterBy = (property, value, operator = "==") =>
  where(property, operator, value);

export const find = async (path, filters = [], handler = (x) => x) => {
  const q = query(path, ...filters);
  const results = await getDocs(q);
  return handler(results.docs.map(normalizeSnapshot))();
};

export const insert = async (path, doc, handler = () => {}) => {
  const result = await setDoc(path, doc);
  handler();
  return result;
};

export const update = async (path, doc, handler = () => {}) => {
  const result = await updateDoc(path, doc);
  handler();
  return result;
};

export const remove = async (path, handler = () => {}) => {
  const result = await deleteDoc(path, doc);
  handler();
  return result;
};

export const persist = {
  all,
  findById,
  filterBy,
  find,
  insert,
  update,
  remove,
};
