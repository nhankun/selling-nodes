
class CourseRepository {

    index(req, res){
        Course.find({},function(err, courses){
            if(!err) 
                pass
            else 
                pass
          });
    }

    store(req, res){
        const course = new Course();
        course.name = req.body.name;
        course.description = req.body.description;
        course.image = req.body.image;

        course.save(function(err){
            if(!err) pass
            else pass
        })
    }

    edit(req, res){
        let idCourse = req.params.id;
        Course.findById(idCourse, function(err, course) {
            if (err) {
                pass
            } else {
                pass
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
                    pass
                }
                else pass
            })    
        } catch (error) {
            
        }
        
    }

}

module.exports = new CourseRepository;