import http from "../HTTP_SERVICE/HTTP-COMMON";

class TeacherClassesDataService {
    getAll() {
        return http.get("/teacher/classrooms");
    }

    get(id) {
        return http.get(`/teacher/classrooms/${id}`);
    }

    create(data) {
        return http.post("/teacher/classrooms", data);
    }

    update(id, data) {
        return http.put(`/teacher/classrooms/${id}`, data);
    }

    delete(id) {
        return http.delete(`/teacher/classrooms/${id}`);
    }

    //Class Students
    getAllStudents(id)  {
        return http.get(`/teacher/students/classrooms/${id}`);
    }

    showStudent(classID,stuID){
        return http.get(`teacher/classrooms/${classID}/students/${stuID}`)
    }

    storeStudent(classID,stuID){
        return http.get(`teacher/add/classrooms/${classID}/students/${stuID}`)
    }

    updateStudentMarks(classID,stuID,data){
        return http.put(`teacher/update/classrooms/${classID}/students/${stuID}`,data)
    }

    removeStudentFromClass(classID,stuID){
        return http.delete(`teacher/classrooms/${classID}/students/${stuID}`)
    }


}

export default new TeacherClassesDataService();
