
const hodSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  email: String,

  department: String,

  // Extra powers
  canApproveFaculty: Boolean,
  canApproveStudents: Boolean,

  isActive: Boolean

}, { timestamps: true });