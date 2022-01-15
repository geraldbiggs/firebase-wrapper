import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const setDirectory = (segments, name, suffix = ".jpg") => {
  return segments.join("/") + name + suffix;
};

export const makeStorageRef = (storage, path) => ref(getStorage(), path);

export const uploadStorage = (storageRef, file, handler = (snapshot) => {}) =>
  uploadBytes(storageRef, file).then(handler);
