
import { LightningElement } from 'lwc';

const STORAGE_KEY = 'studentDetailsRecords';

export default class StudentDetails extends LightningElement {
    studentName = '';
    studentEmail = '';
    studentMobile = '';
    studentCourse = '';
    searchTerm = '';

    students = [];
    nextId = 1;

    courseOptions = [
        { label: 'B.Tech', value: 'B.Tech' },
        { label: 'B.Sc', value: 'B.Sc' },
        { label: 'B.Com', value: 'B.Com' },
        { label: 'BCA', value: 'BCA' },
        { label: 'MBA', value: 'MBA' },
        { label: 'MCA', value: 'MCA' },
        { label: 'Other', value: 'Other' }
    ];

    connectedCallback() {
        try {
            const savedData = window.localStorage.getItem(STORAGE_KEY);

            if (savedData) {
                const parsedData = JSON.parse(savedData);

                if (Array.isArray(parsedData)) {
                    this.students = parsedData.filter(student =>
                        student &&
                        Number.isInteger(student.id) &&
                        typeof student.studentId === 'string' &&
                        typeof student.name === 'string' &&
                        typeof student.email === 'string' &&
                        typeof student.mobile === 'string' &&
                        typeof student.course === 'string'
                    );
                }
            }

            const maxId = this.students.reduce(
                (max, student) => Math.max(max, student.id),
                0
            );

            this.nextId = maxId + 1;
        } catch (error) {
            console.error('Unable to load student records:', error);
            this.students = [];
        }
    }

    handleInputChange(event) {
        const fieldName = event.target.name;

        if (fieldName === 'name') {
            this.studentName = event.target.value;
        } else if (fieldName === 'email') {
            this.studentEmail = event.target.value;
        } else if (fieldName === 'mobile') {
            this.studentMobile = event.target.value;
        } else if (fieldName === 'course') {
            this.studentCourse = event.detail.value;
        }
    }

    handleSearch(event) {
        this.searchTerm = event.target.value;
    }

    addStudent() {
        const inputs = [
            ...this.template.querySelectorAll(
                'lightning-input, lightning-combobox'
            )
        ];

        const isValid = inputs.reduce((valid, input) => {
            input.reportValidity();
            return input.checkValidity() && valid;
        }, true);

        if (!isValid) {
            return;
        }

        const name = this.studentName.trim();
        const email = this.studentEmail.trim();
        const mobile = this.studentMobile.trim();
        const course = this.studentCourse;

        if (!name || !email || !mobile || !course) {
            return;
        }

        const student = {
            id: this.nextId,
            studentId: `STU${String(this.nextId).padStart(3, '0')}`,
            name,
            email,
            mobile,
            course
        };

        this.students = [...this.students, student];
        this.nextId += 1;

        this.saveStudents();
        this.clearForm();
    }

    deleteStudent(event) {
        const studentId = Number(event.currentTarget.dataset.id);

        this.students = this.students.filter(
            student => student.id !== studentId
        );

        this.saveStudents();
    }

    clearForm() {
        this.studentName = '';
        this.studentEmail = '';
        this.studentMobile = '';
        this.studentCourse = '';

        const inputs = [
            ...this.template.querySelectorAll(
                'lightning-input, lightning-combobox'
            )
        ];

        inputs.forEach(input => {
            if (input.name !== undefined) {
                input.value = '';
            }
        });
    }

    saveStudents() {
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(this.students)
            );
        } catch (error) {
            console.error('Unable to save student records:', error);
        }
    }

    get totalStudents() {
        return this.students.length;
    }

    get filteredStudents() {
        const search = this.searchTerm.trim().toLowerCase();

        if (!search) {
            return this.students;
        }

        return this.students.filter(student =>
            student.studentId.toLowerCase().includes(search) ||
            student.name.toLowerCase().includes(search) ||
            student.email.toLowerCase().includes(search) ||
            student.mobile.toLowerCase().includes(search) ||
            student.course.toLowerCase().includes(search)
        );
    }

    get hasStudents() {
        return this.filteredStudents.length > 0;
    }

    get emptyMessage() {
        return this.students.length === 0
            ? 'No student records available. Add your first student!'
            : 'No students match your search.';
    }
}
