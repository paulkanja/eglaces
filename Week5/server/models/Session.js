import mongoose from "mongoose"

const sessionSchema = mongoose.Schema(
    {
        user: mongoose.Schema.Types.ObjectId
    },
    {
        methods: {
            details() {
                return {
                    key: this.key,
                    user: this.user,
                    createdAt: this.createdAt,
                }
            },
        },
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        virtuals: {
            key: {
                get() { return this._id.toString() }
            }
        }
    }
)

const Session = mongoose.model("Session", sessionSchema)

export default Session
