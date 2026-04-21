const transportSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  email: String,

  vehicles: [
    {
      vehicleNo: String,
      driver: String,
      route: String
    }
  ],

  isActive: Boolean

}, { timestamps: true });