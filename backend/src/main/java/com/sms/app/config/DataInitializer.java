package com.sms.app.config;

import com.sms.app.entity.*;
import com.sms.app.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final TimetableRepository timetableRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ExamRepository examRepository;
    private final ResultRepository resultRepository;
    private final FeeStructureRepository feeStructureRepository;
    private final InvoiceRepository invoiceRepository;
    private final LeadRepository leadRepository;
    private final ComplaintRepository complaintRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Initializing system roles, administrator and demo datasets...");

        // 1. Initialize Roles
        Role adminRole = initRole(RoleType.ROLE_ADMIN, "System Administrator");
        Role studentRole = initRole(RoleType.ROLE_STUDENT, "Enrolled Student");
        Role teacherRole = initRole(RoleType.ROLE_TEACHER, "Faculty Instructor");
        Role parentRole = initRole(RoleType.ROLE_PARENT, "Guardian / Parent");
        Role salesRole = initRole(RoleType.ROLE_SALES, "Sales & Admissions Representative");
        Role affairsRole = initRole(RoleType.ROLE_STUDENT_AFFAIR, "Student Affairs Officer");

        // 2. Default Administrator
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@sms.edu")
                    .password(passwordEncoder.encode("Admin@123"))
                    .fullName("Headmaster Admin")
                    .phoneNumber("+1-555-0100")
                    .active(true)
                    .roles(Set.of(adminRole))
                    .build();
            userRepository.save(admin);
            log.info("Default administrator seeded: admin / Admin@123");
        }

        // 3. Faculty Teacher
        Teacher teacher = null;
        if (!userRepository.existsByUsername("teacher1")) {
            User teacherUser = User.builder()
                    .username("teacher1")
                    .email("dr.smith@sms.edu")
                    .password(passwordEncoder.encode("Teacher@123"))
                    .fullName("Dr. John Smith")
                    .phoneNumber("+1-555-0101")
                    .active(true)
                    .roles(Set.of(teacherRole))
                    .build();
            teacherUser = userRepository.save(teacherUser);

            teacher = Teacher.builder()
                    .user(teacherUser)
                    .employeeCode("TCH-2026-001")
                    .specialization("Distributed Computing & Artificial Intelligence")
                    .qualification("Ph.D. in Computer Science")
                    .hireDate(LocalDate.of(2022, 8, 15))
                    .build();
            teacher = teacherRepository.save(teacher);
            log.info("Default teacher seeded: teacher1 / Teacher@123");
        } else {
            teacher = teacherRepository.findByEmployeeCode("TCH-2026-001").orElse(null);
        }

        // 4. Academic Course & Subject
        Course course = null;
        if (!courseRepository.existsByCode("CS101")) {
            course = Course.builder()
                    .code("CS101")
                    .name("Introduction to Computer Science & AI")
                    .description("Core computing concepts, data structures, algorithms and introductory machine learning.")
                    .credits(4)
                    .teacher(teacher)
                    .build();
            course = courseRepository.save(course);

            Subject subject1 = Subject.builder()
                    .code("CS101-ALG")
                    .name("Algorithms and Data Structures")
                    .course(course)
                    .teacher(teacher)
                    .build();
            subjectRepository.save(subject1);

            Timetable timetable = Timetable.builder()
                    .course(course)
                    .subject(subject1)
                    .teacher(teacher)
                    .dayOfWeek("MONDAY")
                    .startTime(LocalTime.of(9, 0))
                    .endTime(LocalTime.of(10, 30))
                    .roomNumber("Lab 301")
                    .build();
            timetableRepository.save(timetable);

            FeeStructure feeStructure = FeeStructure.builder()
                    .course(course)
                    .title("Fall 2026 Tuition Fee")
                    .amount(BigDecimal.valueOf(1200.00))
                    .dueDate(LocalDate.of(2026, 11, 30))
                    .term("FALL-2026")
                    .academicYear("2026-2027")
                    .build();
            feeStructureRepository.save(feeStructure);
        } else {
            course = courseRepository.findByCode("CS101").orElse(null);
        }

        // 5. Parent & Student
        Parent parent = null;
        if (!userRepository.existsByUsername("parent1")) {
            User parentUser = User.builder()
                    .username("parent1")
                    .email("robert.walker@example.com")
                    .password(passwordEncoder.encode("Parent@123"))
                    .fullName("Robert Walker")
                    .phoneNumber("+1-555-0102")
                    .active(true)
                    .roles(Set.of(parentRole))
                    .build();
            parentUser = userRepository.save(parentUser);

            parent = Parent.builder()
                    .user(parentUser)
                    .occupation("Software Engineer")
                    .relationship("FATHER")
                    .build();
            parent = parentRepository.save(parent);
            log.info("Default parent seeded: parent1 / Parent@123");
        }

        if (!userRepository.existsByUsername("student1")) {
            User studentUser = User.builder()
                    .username("student1")
                    .email("alice.walker@sms.edu")
                    .password(passwordEncoder.encode("Student@123"))
                    .fullName("Alice Walker")
                    .phoneNumber("+1-555-0103")
                    .active(true)
                    .roles(Set.of(studentRole))
                    .build();
            studentUser = userRepository.save(studentUser);

            Student student = Student.builder()
                    .user(studentUser)
                    .studentCode("STU-2026-0001")
                    .dob(LocalDate.of(2004, 5, 14))
                    .gender("FEMALE")
                    .address("42 University Ave, Innovation District")
                    .emergencyContact("+1-555-0102")
                    .parent(parent)
                    .build();
            student = studentRepository.save(student);

            if (course != null) {
                Enrollment enrollment = Enrollment.builder()
                        .student(student)
                        .course(course)
                        .enrollmentDate(LocalDate.of(2026, 9, 1))
                        .status("ACTIVE")
                        .build();
                enrollmentRepository.save(enrollment);

                // Add sample attendance
                attendanceRepository.save(Attendance.builder()
                        .student(student)
                        .course(course)
                        .attendanceDate(LocalDate.now().minusDays(2))
                        .status(AttendanceStatus.PRESENT)
                        .remarks("On time")
                        .build());

                attendanceRepository.save(Attendance.builder()
                        .student(student)
                        .course(course)
                        .attendanceDate(LocalDate.now().minusDays(1))
                        .status(AttendanceStatus.PRESENT)
                        .remarks("Active participant")
                        .build());

                // Add exam and result
                List<Subject> subjects = subjectRepository.findByCourseId(course.getId());
                if (!subjects.isEmpty()) {
                    Exam exam = Exam.builder()
                            .title("Midterm Examination")
                            .examDate(LocalDate.now().minusDays(5))
                            .course(course)
                            .subject(subjects.get(0))
                            .maxMarks(BigDecimal.valueOf(100.00))
                            .term("FALL-2026")
                            .build();
                    exam = examRepository.save(exam);

                    resultRepository.save(Result.builder()
                            .exam(exam)
                            .student(student)
                            .marksObtained(BigDecimal.valueOf(88.50))
                            .grade("A")
                            .remarks("Excellent analytical depth in data structures")
                            .publishedAt(LocalDateTime.now().minusDays(3))
                            .build());
                }

                // Add sample invoice
                List<FeeStructure> feeStructures = feeStructureRepository.findByCourseId(course.getId());
                if (!feeStructures.isEmpty()) {
                    invoiceRepository.save(Invoice.builder()
                            .invoiceNumber("INV-2026-0001")
                            .student(student)
                            .feeStructure(feeStructures.get(0))
                            .totalAmount(feeStructures.get(0).getAmount())
                            .paidAmount(BigDecimal.valueOf(600.00))
                            .balanceAmount(BigDecimal.valueOf(600.00))
                            .status(InvoiceStatus.PARTIAL)
                            .dueDate(feeStructures.get(0).getDueDate())
                            .build());
                }
            }
            log.info("Default student seeded: student1 / Student@123 (STU-2026-0001)");
        }

        // 6. Sales & Affairs Officers
        if (!userRepository.existsByUsername("sales1")) {
            User salesUser = User.builder()
                    .username("sales1")
                    .email("sarah.sales@sms.edu")
                    .password(passwordEncoder.encode("Sales@123"))
                    .fullName("Sarah Connor")
                    .phoneNumber("+1-555-0104")
                    .active(true)
                    .roles(Set.of(salesRole))
                    .build();
            userRepository.save(salesUser);

            leadRepository.save(Lead.builder()
                    .fullName("David Miller")
                    .email("david.miller@gmail.com")
                    .phone("+1-555-8888")
                    .interestedCourse("CS101")
                    .status(LeadStatus.QUALIFIED)
                    .source("Web Admissions Form")
                    .notes("Interested in computer science and AI courses.")
                    .assignedUser(salesUser)
                    .build());
        }

        if (!userRepository.existsByUsername("affairs1")) {
            User affairsUser = User.builder()
                    .username("affairs1")
                    .email("affairs@sms.edu")
                    .password(passwordEncoder.encode("Affairs@123"))
                    .fullName("Michael Scott")
                    .phoneNumber("+1-555-0105")
                    .active(true)
                    .roles(Set.of(affairsRole))
                    .build();
            userRepository.save(affairsUser);

            complaintRepository.save(Complaint.builder()
                    .title("Library Study Room Air Conditioning Issue")
                    .description("The AC unit in study room B on the 2nd floor is vibrating loudly.")
                    .raisedBy(affairsUser)
                    .severity(ComplaintSeverity.LOW)
                    .status(ComplaintStatus.PENDING)
                    .build());
        }

        log.info("System data initialization completed successfully.");
    }

    private Role initRole(RoleType name, String description) {
        return roleRepository.findByName(name)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(name)
                        .description(description)
                        .build()));
    }
}
