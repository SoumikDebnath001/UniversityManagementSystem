const parentSchema = new mongoose.Schema({
  parentId: String,
  name: String,
  email: String,
  phone: String,

  studentId: String,
  relation: String,

  isActive: Boolean

}, { timestamps: true });