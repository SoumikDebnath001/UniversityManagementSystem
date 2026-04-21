const hrSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  email: String,

  employeesManaged: [{ type: String }],

  recruitment: [
    {
      role: String,
      status: String
    }
  ],

  isActive: Boolean

}, { timestamps: true });