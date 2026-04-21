const wardenSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  email: String,

  hostelName: String,

  studentsAllotted: [{ type: String }],

  complaints: [
    {
      studentId: String,
      issue: String,
      status: String
    }
  ],

  isActive: Boolean

}, { timestamps: true });