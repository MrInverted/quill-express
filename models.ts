import { Schema, SchemaTypes, model } from "mongoose";

const docSchema = new Schema({
  _id: { type: SchemaTypes.String, require: true },
  data: { type: SchemaTypes.Mixed, default: "" }
})

const DocModel = model("document", docSchema);

// ----------------------

const createOrReturn = async (id: string) => {
  if (!id) return;

  const isDocument = await DocModel.findById(String(id));

  if (isDocument) return isDocument;

  // console.log({ isDocument })

  const newDocument = await DocModel.create({ _id: id });

  return newDocument;
}

const saveDocument = async (id: string, data: any) => {
  // console.log(data)

  const savedDocument = await DocModel.findByIdAndUpdate(id, { data }, { new: true });

  // console.log({ savedDocument })

  return savedDocument;
}



export { createOrReturn, saveDocument };