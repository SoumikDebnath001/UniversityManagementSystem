const mongoose = require("mongoose");

const { Schema, model } = mongoose;
const departmentSchema = new Schema(
    {

            name: { type: String },
            description: { type: String }
    },
    { _id: true }
)

const courseSchema = new Schema(
    {
        courseTitle: {
            type: String,
            required: true,
            trim: true,
        },
        courseCode: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        semester: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },
        department: [departmentSchema],

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

courseSchema.index({ courseCode: 1 }, { unique: true });

const Course = model("course", courseSchema);

module.exports = Course;



//course and departmet CRUD by admin   ///////////////////////////////done
//user can view only  course wise dpartments filter
//admin -> hod  email:email, password: email  , token:token
//hod  -> login  chnage pass , get my proile 
