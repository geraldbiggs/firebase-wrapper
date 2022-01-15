import {
  serverTimestamp,
  deleteField as firebaseDeleteField,
} from "firebase/firestore";
import { sanitizeDoc } from "./sanitizeDoc";
import { pipe } from "utilities";

export const basicTransformer = {
  toFirestore: (doc) => {
    return sanitizeDoc(doc);
  },
  fromFirestore: (snapshot, options) => {
    return snapshot.data(options);
  },
};

export const buildTransformer = ({
  to = [(x) => x],
  from = [(x) => x],
} = {}) => {
  return {
    toFirestore: (doc) => {
      return pipe(...to)(sanitizeDoc(doc));
    },
    fromFirestore: (snapshot, options) => {
      return pipe(...from)(snapshot.data(options));
    },
  };
};

export const timeStamp = () => serverTimestamp();

export const setField = (parts, value) => (obj) => {
  let key = Array.isArray(parts) ? parts.join(".") : parts;
  return { ...obj, [key]: value };
};

export const deleteField = (parts) => (obj) => {
  let key = Array.isArray(parts) ? parts.join(".") : parts;
  return { ...obj, [key]: firebaseDeleteField() };
};

export const setUserId =
  (userId) =>
  (isEditing = false) =>
  (obj) =>
    setField([!isEditing ? "createdBy" : "updatedBy"], userId)(obj);
