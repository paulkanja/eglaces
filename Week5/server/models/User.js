import mongoose from "mongoose"

const userSchema = mongoose.Schema(
    {
        phash: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    {
        methods: {
            details() {
                return {
                    uid: this.uid,
                    email: this.email,
                    createdAt: this.createdAt,
                }
            },
        },
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        virtuals: {
            uid: {
                get() { return this._id.toString() }
            }
        }
    }
)

const User = mongoose.model("User", userSchema)

export default User
