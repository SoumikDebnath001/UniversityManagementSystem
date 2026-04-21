const placementSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  email: String,

  companies: [
    {
      name: String,
      package: Number
    }
  ],

  placedStudents: [
    {
      studentId: String,
      company: String
    }
  ],

  isActive: Boolean

}, { timestamps: true });