const financeSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  email: String,

  department: String,
   handledPayments: [
    {
      id:Object,
      name:String,
      role: String,
      amount: Number,
      transactionId:String,
      TransactionProcess:String,
      date: Date,
      status: String
    }
  ],
  

  isActive: Boolean

}, { timestamps: true });