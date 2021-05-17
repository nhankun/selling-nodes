// model
const Course = require('../models/Course');

class CourseController {

    index(req, res){
        Course.find({},function(err, courses){
            if(!err) 
                res.render("courses/index", {courses: courses})
            else 
                res.status(400).json({error: 'ERROR!!!'});
          });
    }

    create(req, res){
        res.render("courses/create");
    }

    store(req, res){
        const course = new Course();
        course.name = req.body.name;
        course.description = req.body.description;
        course.image = req.body.image;

        course.save(function(err){
            if(!err) res.redirect('/courses');
            else res.status(400).json({error: err});
        })
    }

    edit(req, res){
        let idCourse = req.params.id;
        Course.findById(idCourse, function(err, course) {
            if (err) {
                res.status(400).json({error: err});
            } else {
                res.render("courses/edit", {course: course});
            }
          });
    }

    update(req, res){
        try {
            let idCourse = req.params.id;
            const id = req.params.courseId;
            const updateObject = req.body;
            Course.update({ _id:idCourse }, { $set:updateObject }, function(err, numAffected){
                if(!err) {
                    res.redirect('/courses')
                }
                else res.status(400).json({error: err});
            })    
        } catch (error) {
            
        }
        
    }

}

module.exports = new CourseController;