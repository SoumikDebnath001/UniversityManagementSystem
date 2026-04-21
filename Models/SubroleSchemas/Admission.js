const admissionAgentSchema = new mongoose.Schema({
  agentId: String,
  name: String,
  email: String,

  region: String,

  studentsReferred: [{ type: String }],

  commission: Number,

  isActive: Boolean

}, { timestamps: true });