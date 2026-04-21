const facultySchema = new mongoose.Schema({
  //Basics
  employeeId:String,
  name: String,
  email: String,
  phone: String,
  gender: String,
  dateOfBirth: Date,

  //Academic
  department:String,
  designation:String,
  qualification: [
    {
      degree: String,
      specialization: String,
      university: String,
      year: Number
    }
  ],

  //Employment
  joiningDate: Date,
  experienceYears: Number,
  employmentType:String,
  salary:Number,

  //Subjects
  subjects: [],
  coursesHandled: [],

  timetable: [
    {
      day: String,
      period: String,
      subject: String,
      room: String
    }
  ],

  //Experiances
  researchAreas: [String],
  publications: [
    {
      title: String,
      journal: String,
      year: Number
    }
  ],

  //Administrative Roles
  roles: [],

  //Leave & Attendance
  leavesTaken: Number,
  //isActive
  isActive:Boolean

}, { timestamps: true });