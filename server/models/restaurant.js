import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const Schema = mongoose.Schema;

const restuarantSchema = new Schema(
  {
    name: String,
    address: String,
    cuisines: [String],
    feature_image: String,
    starting_price: Number,
    menu: [
      {
        name: String,
        desc: String,
        price: Number,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

restuarantSchema.plugin(aggregatePaginate);

export default mongoose.model("restaurant", restuarantSchema, "restaurants");
