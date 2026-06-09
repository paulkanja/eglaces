import mongoose from "mongoose"

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        imgstream: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }
    },
    {
        methods: {
            details() {
                return {
                    id: this.id,
                    name: this.name,
                    price: this.price,
                    imgstream: this.imgstream,
                }
            },
        },
        timestamps: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        virtuals: {
            id: {
                get() { return this._id.toString() }
            }
        }
    }
)

const Product = mongoose.model("Product", productSchema)

export default Product
