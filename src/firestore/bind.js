export class FirebaseBind extends BaseFire {
  constructor(path, context) {
    super();
    this.setPath(path);
    this.context = context;
    this.add = context.add;
    this.remove = context.remove;
    this.update = context.update;
  }

  bindDoc(
    docId,
    modifiedFn = (data) => this.context.insertOrUpdate({ data: data }),
    removedFn = (data) => this.context.delete(data.id)
  ) {
    return this.path.doc(docId).onSnapshot((doc) => {
      const cleanDoc = normalizeSnapshot(doc);
      if (doc.exists === true) {
        modifiedFn(cleanDoc);
      } else {
        removedFn(cleanDoc);
      }
    });
  }

  async bindDocs(
    addFn = (data) => this.add(data),
    modifiedFn = (data) => this.update(data),
    removedFn = (data) => this.remove(data)
  ) {
    return await this.path.onSnapshot(
      (ref) => {
        ref.docChanges().forEach((change) => {
          const { doc, type } = change;
          const cleanDoc = normalizeSnapshot(doc);

          if (type === "added") {
            addFn(cleanDoc);
          } else if (type === "modified") {
            modifiedFn(cleanDoc);
          } else if (type === "removed") {
            removedFn(cleanDoc);
          }
        });
      },
      function (error) {
        console.log(error);
        return error;
      }
    );
  }
}
