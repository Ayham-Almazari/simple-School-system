<template>
    <div class="container">
        <div class="text-center mb-2">
            <button type="button" class="btn btn-outline-dark" @click="$refs.ShowStudentSearchInput.open()">Add Student</button>
            <pulse-loader  :loading="studentLoading && (Students===null)" color="#1C1F23" size="15px"></pulse-loader>
        </div>
        <table class="table table-primary table-borderless table-hover " style="font-size: 1vw">
            <thead class="table-dark">
            <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">First_term</th>
                <th scope="col">Mid_term</th>
                <th scope="col">Final_term</th>
                <th scope="col">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="Student in Students" :key="Student.id">
                <th scope="row">{{ Student.id }}</th>
                <td>{{ Student.name }}</td>
                <td>{{ Student.email }}</td>
                <td>{{ Student.phone }}</td>
                <th>{{ Student.first_term ? Student.first_term : "--" }}</th>
                <th>{{ Student.mid_term ? Student.mid_term : "--" }}</th>
                <th>{{ Student.final_term ? Student.final_term : "--" }}</th>
                <td>
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button :stu-id="Student.id" class="btn btn-danger" v-on:click="fetchStudent"
                                @click="$refs.DeleteStudentAlert.open()">Remove
                        </button>
                        <button :stu-id="Student.id" type="button" class="btn btn-outline-dark"
                                v-on:click="fetchStudent" @click="$refs.EditStudentModal.open()">Edit
                        </button>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        <sweet-modal ref="DeleteStudentAlert" icon="warning">
            <br>
            <rise-loader :loading="isLoading" size="15px" color="#F8BE86"></rise-loader>
            <div v-if="student && !isLoading">
                Are You Sure , You Got To Remove Student <span
                style="text-decoration: line-through;color: red">{{ student.name }}</span> From
                <i>{{ Classroom.class_name }}</i> Class .
            </div>
            <button class="btn btn-outline-danger" v-on:click="removeStudent" :disabled="isLoading">Remove
                Student
            </button>
        </sweet-modal>
        <sweet-modal icon="success" ref="SuccessDeleteStudent">
            <div v-if="student" style="padding-top: 50px;z-index: 3"> Student "{{ student.name }}" From
                {{ Classroom.class_name }} Class Removed Successfully .
            </div>
        </sweet-modal>
        <sweet-modal ref="EditStudentModal">
            <pulse-loader :loading="isLoading" color="#1C1F23" size="15px"></pulse-loader>
            <div class="container" v-if="student && !isLoading">
                <h3 class="text-center">Edit Student <u>{{ student.name }}</u> Marks In
                    <i>{{ Classroom.class_name }}</i> Class</h3>
                <form @submit.prevent="UpdateStudentMarks" class="container mt-5" @keydown="form.onKeydown($event)">
                    <AlertError :form="form" message="Student Marks Is Not Updated ! ." class="text-center"/>
                    <AlertSuccess :form="form" message="Student Marks Updated Successfully! ." class="text-center"
                                  v-bind:style="{display:EditMarksSuccessAlert}"/>
                    <div class="row mb-2 d-flex justify-content-center">
                        <div class="col-sm-10 ">
                            <input v-model="student.first_term" type="text" name="first_term" class="form-control"
                                   placeholder="First Term" autocomplete="off">
                            <HasError :form="form" field="first_term"/>
                        </div>
                    </div>
                    <div class="row mb-2 d-flex justify-content-center">
                        <div class="col-sm-10 ">
                            <input v-model="student.mid_term" type="text" name="mid_term" class="form-control"
                                   placeholder="Mid Term" autocomplete="off">
                            <HasError :form="form" field="mid_term"/>
                        </div>
                    </div>
                    <div class="row mb-2 d-flex justify-content-center">
                        <div class="col-sm-10 ">
                            <input v-model="student.final_term" type="text" name="final_term" class="form-control"
                                   placeholder="Final Term" autocomplete="off">
                            <HasError :form="form" field="final_term"/>
                        </div>
                    </div>
                    <div class="row mb-3 d-flex justify-content-center">
                        <div class="d-flex justify-content-center">
                            <Button :form="form" class="btn btn-dark mt-4 hvr-buzz-out" :disabled="isLoading">
                                Edit Marks
                            </Button>
                        </div>
                    </div>
                </form>
                <sweet-modal icon="success" ref="openCreateClassroomSuccess">
                    Classroom Updated Successfully
                </sweet-modal>
            </div>
        </sweet-modal>
        <sweet-modal ref="ShowStudentSearchInput" class="bg-dark">
            <div class="input-group flex-nowrap">
                <span class="input-group-text" id="addon-wrapping"><i class="fa fa-search"></i></span>
                <input type="text" class="form-control" placeholder="Type Student Name" aria-label="Username" aria-describedby="addon-wrapping"
                       v-model="StudentNameSearch" v-on:keyup="SearchStudentToAdd">
            </div>
            <div v-if="StudentsFeed === null">No Students</div>
            <ul class="list-group" >
                <li v-for="student in StudentsFeed" v-bind:key="student.id"
                    class="list-group-item  list-group-item-info d-flex justify-content-between align-items-center">
                    {{ student.name }}
                    <button class="btn btn-outline-info" :stu-id="student.id" @click="AddStudentToClass">Add</button>
                </li>
            </ul>
        </sweet-modal>
        <sweet-modal ref="StudentAddedSuccessfullyToClass" icon="success">
           <div >{{ recentStudentAddedSuccessfullyMessage }}</div>
        </sweet-modal>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import {SweetModal} from 'sweet-modal-vue'
import RiseLoader from 'vue-spinner/src/RiseLoader.vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import Form from "vform";
import {AlertError, AlertSuccess, Button, HasError} from "vform/src/components/bootstrap5";
import TeacherClassesDataService from "../../store/modules/HTTP_SERVICE/TeacherClassesDataService";

export default {
    data: () => ({
        form: Form.make({
            first_term: null,
            mid_term: null,
            final_term: null
        }),
        EditMarksSuccessAlert: "none",
        StudentNameSearch: "",
        StudentsFeed: null,
        recentStudentAddedSuccessfullyMessage:null
    }),
    components: {
        SweetModal,
        RiseLoader,
        PulseLoader,
        Button, HasError, AlertError, AlertSuccess
    },
    name: "ClassStudents"
    ,
    mounted() {
        this.$store.dispatch('TeacherClassesStudents/fetchTeacherStudents', this.$route.params.classroom)
        this.$store.dispatch('TeacherClasses/fetchTeacherClass', this.$route.params.classroom)
    },
    computed: {
        ...mapGetters({
            Students: "TeacherClassesStudents/ClassStudents",
            Classroom: "TeacherClasses/Classroom",
            student: "TeacherClassesStudents/ClassStudent",
            isLoading: "TeacherClassesStudents/isLoading",
            studentLoading:"TeacherClassesStudents/studentLoading"
        })
    },
    methods: {
        fetchStudent: function (event) {
            let id = event.target.getAttribute('stu-id')
            this.$store.dispatch('TeacherClassesStudents/fetchTeacherClassroomStudent', {
                classID: this.$route.params.classroom,
                stuID: id
            })
            this.EditMarksSuccessAlert = "none"
        },
        removeStudent: function () {
            this.$store.dispatch('TeacherClassesStudents/removeStudentFromClassroom', {
                classID: this.$route.params.classroom,
                stuID: this.student.id
            })
            this.$store.dispatch('TeacherClassesStudents/fetchTeacherStudents', this.$route.params.classroom)
            this.$refs.SuccessDeleteStudent.open()
            this.$refs.DeleteStudentAlert.close()
        },
        UpdateStudentMarks: function () {
            this.form.first_term = this.student.first_term
            this.form.mid_term = this.student.mid_term
            this.form.final_term = this.student.final_term
            this.form.put(`/api/v1/teacher/update/classrooms/${this.$route.params.classroom}/students/${this.student.id}/marks`).then(({data}) => {
                this.EditMarksSuccessAlert = "block"
                this.$store.dispatch('TeacherClassesStudents/fetchTeacherStudents', this.$route.params.classroom)
            }).catch((errors) => {
                console.log(errors.response.data)
            })
        },
        SearchStudentToAdd() {
            TeacherClassesDataService.getAllStudentsSearch(this.StudentNameSearch, this.$route.params.classroom)
                .then(response => {
                    this.StudentsFeed = response.data.data;
                })
                .catch(error => console.log(error))
        },
        AddStudentToClass(event){
            let id = event.target.getAttribute('stu-id')
            TeacherClassesDataService.storeStudent(this.$route.params.classroom,id).then(({data})=>{
                this.recentStudentAddedSuccessfullyMessage = data.msg;
                this.$refs.StudentAddedSuccessfullyToClass.open()
                this.$store.dispatch('TeacherClassesStudents/fetchTeacherStudents', this.$route.params.classroom)
            })
        }
    }
}
</script>

<style scoped>
.customSearchAddStudent{
}
</style>
