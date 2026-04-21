const examControllerSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  email: String,

  examsManaged: [
    {
      examName: String,
      semester: Number,
      date: Date
    }
  ],

  resultPublished: Boolean,

  isActive: Boolean

}, { timestamps: true });