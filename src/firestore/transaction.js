export class FirebaseTransaction extends BaseFire {
  constructor() {
    super();
    this.transaction = null;
  }

  makeRef(path, id = null) {
    return id
      ? this.dbInstance.collection(path).doc(id)
      : this.dbInstance.collection(path).doc();
  }

  async start(action) {
    return await this.dbInstance.runTransaction(action);
  }
}
