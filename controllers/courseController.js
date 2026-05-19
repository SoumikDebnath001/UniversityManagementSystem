const Course = require('../Models/CourseSchema');
///////////////////////////////////////////////////////////////////////////////create course
exports.createCourse = async (req, res) => {
    try {
        const { courseTitle, courseCode, semester } = req.body;

        const existingCourse = await Course.findOne({ courseCode });
        if (existingCourse) {
            return res.status(400).json({ message: 'Course code already exists' });
        }

        const course = await Course.create({ courseTitle, courseCode, semester});
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
////////////////////////////////////////////////////////////////////////////////get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
//////////////////////////////////////////////////////////////////////////////////get course by id
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
///////////////////////////////////////////////////////////////////////////////////update course
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
////////////////////////////////////////////////////////////////////////////////////delete course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
////////////////////////////////////////////////////////////////////////////////add department to course
exports.addDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;

        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        course.department.push({ name, description });
        await course.save();

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
////////////////////////////////////////////////////////////////////////////////remove department from course
exports.removeDepartment = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const deptIndex = course.department.findIndex(d => d._id.toString() === req.params.deptId);
        if (deptIndex === -1) return res.status(404).json({ message: 'Department not found' });

        course.department.splice(deptIndex, 1);
        await course.save();

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
//////////////////////////////////////////////////////////////////////////////////////
exports.getDepartmentsByCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        res.status(200).json(course.department);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
