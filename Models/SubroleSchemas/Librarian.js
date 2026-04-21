const librarianSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  email: String,

  booksManaged: Number,

  issuedBooks: [
    {
      studentId: String,
      bookId: String,
      issueDate: Date,
      returnDate: Date
    }
  ],

  isActive: Boolean

}, { timestamps: true });