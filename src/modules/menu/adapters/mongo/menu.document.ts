import { model, ObjectId, Schema } from 'mongoose';

export interface IMenuDocument {
  _id: ObjectId;
  name: string;
  related_id?: ObjectId;
}

const schema = new Schema<IMenuDocument>({
  name: { type: String, required: true },
  related_id: { type: Schema.Types.ObjectId, required: false },
});

schema.index({ related_id: 1 });

export const MenuDocument = model<IMenuDocument>('menu', schema, 'menus');
 