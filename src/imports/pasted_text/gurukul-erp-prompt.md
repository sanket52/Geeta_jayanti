MASTER DEVELOPMENT PROMPT
Project Name
Maharishi Panini Ved Vedang Gurukul — Official ERP, Competition Examination & Student Portal
Build a complete, production-ready web platform for:
Maharishi Panini Ved Vedang Gurukul
The platform should contain:
Official Gurukul Website
Student Registration System
Student Login Portal
Admin Login Portal
Gurukul ERP
Competition Examination Portal
Online MCQ Examination
Oral/Video Examination
Document Management
Online Donation System
Online Receipt Generation & Download
Email Notification System
Student Profile Management
Library Portal
Admin Analytics & Statistics
Data Export System
Secure JWT Authentication
Role-Based Access Control
SQL Database
Complete responsive modern UI
1. TECHNOLOGY STACK
Use the MERN architecture as the primary application architecture.
Frontend
React.js
Vite
React Router
Tailwind CSS
Shadcn/UI or another modern component library
Axios
React Hook Form
1.
2.
3.
4.
5.
6.
7.
8.
9.
10.
11.
12.
13.
14.
15.
16.
17.
18.
19.
20.
•
•
•
•
•
•
•
1
Zod validation
TanStack Query where useful
Recharts for admin statistics
Responsive design for desktop, tablet and mobile
Backend
Node.js
Express.js
REST API architecture
JWT authentication
bcrypt/argon2 password hashing
Role-Based Access Control
Multer or equivalent secure file upload system
Nodemailer/email service
Input validation
Rate limiting
Helmet
CORS
Centralized error handling
Request logging
Database
The requirement is to use a SQL relational database.
Preferred:
PostgreSQL
Use an ORM such as:
Prisma ORM
Do NOT use MongoDB for the core ERP/examination data because the requirement is for SQL.
Storage
Do not store large videos directly inside PostgreSQL.
Use object/file storage for:
Student photographs
Aadhaar/document uploads
Bank documents where legitimately required
Certificates
Examination videos
Receipts
Other uploaded documents
Store only the secure file URL/path and metadata in PostgreSQL.
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
2
2. APPLICATION STRUCTURE
Create separate modules:
Public Website
/
Student Portal
/student
Competition Examination Portal
/competition
Library Portal
/library
Admin ERP
/admin
The competition examination portal should feel like a separate application/module while using the
same authentication and backend infrastructure.
3. PUBLIC WEBSITE
Create a professional website representing a traditional Vedic Gurukul.
The design should combine:
Indian/Vedic cultural identity
Modern professional UI
Sanskrit/Vedic visual elements
Clean typography
Responsive layout
Premium institutional appearance
Use appropriate colors inspired by:
Saffron
Cream
White
Deep red/maroon
Gold
Dark brown
•
•
•
•
•
•
•
•
•
•
•
•
3
Do not make the design overly flashy.
4. HOME PAGE
Create a complete home page containing:
Header
Gurukul logo
Gurukul name
Navigation
Home
About
Activities
Competitions
Examination
Library
Donation
Contact
Student Login
Admin Login
Hero Section
Display:
Maharishi Panini Ved Vedang Gurukul
Add a Sanskrit/Vedic-inspired slogan.
Add buttons:
Register for Competition
Student Login
Learn More
About Gurukul
Show:
Gurukul introduction
Vision
Mission
Vedic education
Sanskrit education
Traditional values
Modern education
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
4
Upcoming Competition
Show:
Competition name
Registration start date
Registration closing date
Examination date
Eligibility
Subjects
Prize information
Registration button
Statistics
Show dynamic statistics such as:
Registered Students
Competitions Conducted
Students Participated
Awards
Years of Service
These should be manageable from Admin.
Gallery
Images of:
Gurukul
Students
Events
Competitions
Teachers
Activities
Notice Board
Dynamic announcements managed from Admin.
Testimonials
Student/parent/teacher testimonials.
Footer
Include:
Address
Contact
Email
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
5
Social media
Important links
Privacy Policy
Terms
Donation
Competition registration
5. ABOUT PAGE
Create detailed sections:
History
About Gurukul
Vision
Mission
Objectives
Vedic Education
Sanskrit Education
Teachers
Infrastructure
Activities
Achievements
Admin should be able to update important content.
6. DONATION PAGE
Create a professional donation page.
Include:
Donation purpose
Gurukul bank/payment information
Online payment integration
Donor form
Donation amount
Donor name
Email
Mobile number
Address
PAN if legally required
Payment reference
Donation receipt
After successful donation:
Save transaction
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
1.
6
Generate receipt
Generate unique receipt number
Send confirmation email
Allow donor to download receipt
Example:
GURUKUL-2026-000012
Admin should be able to view:
Total donations
Today's donations
Monthly donations
Yearly donations
Donor information
Payment status
7. STUDENT REGISTRATION
Create a comprehensive student registration system for the competition.
Registration should be multi-step.
Step 1 — Basic Information
Fields:
Full Name
Father's Name
Mother's Name
Date of Birth
Gender
Mobile Number
Email
Address
Village/Town
District
State
PIN Code
Step 2 — Educational Information
Fields:
School/College
Class/Course
Board/University
2.
3.
4.
5.
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
7
Passing Year
Educational Qualification
Sanskrit Education
Previous Competition Participation
Step 3 — Identity Information
Collect only information genuinely required by the competition and legal process.
Possible fields:
Aadhaar-related identity verification
Government ID type
ID number/reference
ID document upload
Do not expose Aadhaar numbers in the admin UI unnecessarily.
Sensitive identity information must be:
Encrypted where appropriate
Access controlled
Masked in UI
Never displayed publicly
Never included in unnecessary exports
Step 4 — Bank Information
If prizes/scholarships require bank details:
Account Holder Name
Bank Name
Account Number
IFSC
Branch
Cancelled cheque/passbook proof if required
Treat financial information as highly sensitive.
Only authorized administrators should be able to access it.
Step 5 — Documents
Allow uploads for required documents:
Photograph
Signature
Identity proof
Educational certificate
Bank proof
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
8
Other required documents
Validate:
File type
File size
MIME type
Filename
Malware/security checks where possible
Step 6 — Competition Selection
Student selects:
Competition
Category
Age group
Subject
Exam language
Step 7 — Declaration
Student confirms:
Information is correct
Rules accepted
Privacy policy accepted
Examination rules accepted
Then submit.
8. REGISTRATION CONFIRMATION
After successful registration:
Generate a unique:
Registration Number
Example:
MPG-2026-000123
Generate:
Registration confirmation page
Registration PDF
QR code
Registration number
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
9
Student details
Competition details
Send confirmation email.
Email should contain:
Registration number
Competition
Examination date
Login information/instructions
Important instructions
Allow student to download registration confirmation.
9. STUDENT LOGIN
Create secure student authentication.
Student can login using:
Email/mobile
Password
Optional:
OTP verification
Authentication should use:
JWT
Implement:
Access token
Refresh token
Secure token storage strategy
Token expiration
Logout
Token refresh
Password reset
Email verification
Never store plain-text passwords.
10. STUDENT DASHBOARD
After login show:
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
10
Dashboard
Student Name
Registration Number
Profile completion
Competition
Examination status
Upcoming exam
Result
Notifications
Profile
Student can view/edit permitted information.
Some fields should require admin approval after modification.
Example:
Changing:
Name
DOB
Aadhaar-related information
Bank account
should create an:
Admin Verification Request
instead of immediately changing critical records.
Documents
Student can view/download:
Registration confirmation
Admit card
Receipts
Certificates
Result
Other documents
11. ADMIT CARD
Admin can generate admit cards.
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
11
Admit card should contain:
Student photograph
Name
Registration number
Competition
Exam date
Exam time
Exam instructions
QR code
Exam center/online examination information
Allow PDF download.
12. COMPETITION EXAMINATION PORTAL
Create a separate professional examination interface.
Example route:
/competition/exam
The exam interface should NOT look like the normal website.
It should have:
Minimal interface
Timer
Question navigation
Answer status
Submit button
Exam instructions
13. MCQ EXAMINATION
Support MCQ-based exams.
Question structure:
Question
Question image if required
Options A/B/C/D
Correct answer
Marks
Negative marks
Subject
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
12
Difficulty
Explanation
Admin can create questions.
Exam settings:
Duration
Number of questions
Total marks
Passing marks
Randomization
Negative marking
Question order
Option order
14. EXAM SECURITY
Implement:
Exam session token
JWT authentication
Server-side timer validation
Prevent multiple active sessions
Auto-submit when time expires
Save answers periodically
Prevent accidental loss
Detect suspicious activity where technically appropriate
Record login/exam session logs
Do not rely only on frontend JavaScript for exam timing.
The server must validate:
Exam start
Exam end
Submission
Attempt status
15. ORAL EXAMINATION
Some competitions may require an oral examination.
Create an oral examination module.
Student should see:
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
13
Oral Exam Instructions
Then:
Question/prompt
Recording interface
Camera preview
Microphone status
Start Recording
Stop Recording
Preview
Upload
Submit
Allow the student to record a video response.
The uploaded video should be stored in secure object storage.
Database should store:
Student ID
Exam ID
Question ID
Video URL
Upload status
File size
Duration
Submission timestamp
Evaluation status
16. VIDEO SECURITY
Videos may contain personal information.
Implement:
Private storage
Signed temporary URLs
Authorization checks
No public direct URLs
Upload size limits
Supported video formats
Virus/security checks
Metadata validation
Only authorized examiners/admins can watch submitted videos.
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
14
17. ORAL EXAM EVALUATION
Admin/examiner dashboard should allow:
Watch video
Student information
Question
Marks
Comments
Evaluation status
Evaluation:
Pending
Under Review
Evaluated
Rejected/Needs Resubmission
Store evaluator ID and timestamp.
18. RESULT SYSTEM
After examination:
Calculate:
MCQ Score
Correct Answers × Marks - Negative Marks
Combine with oral score if applicable.
Example:
MCQ = 70
Oral = 20
Total = 90
Admin can configure weightage.
Result should show:
Registration number
Student name
Competition
•
•
•
•
•
•
•
•
•
•
•
•
•
15
MCQ marks
Oral marks
Total marks
Percentage
Rank
Qualification status
19. CERTIFICATE SYSTEM
Generate certificates automatically.
Certificate should contain:
Gurukul logo
Student name
Competition
Achievement
Rank
Registration number
Date
Certificate number
QR verification code
Authorized signature
Allow PDF download.
Create public certificate verification:
/verify-certificate/:certificateNumber
Anyone can verify certificate authenticity using certificate number/QR.
20. ADMIN ERP
Create a complete ERP-style Admin Dashboard.
Admin dashboard should have:
Overview
Cards:
Total Students
Active Students
Total Registrations
Today's Registrations
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
16
Total Exams
Completed Exams
Pending Evaluations
Total Donations
21. ADMIN STATISTICS
Create graphs using Recharts.
Statistics:
Registration Statistics
Daily registrations
Weekly registrations
Monthly registrations
State-wise registrations
District-wise registrations
Age-group statistics
Gender statistics
Competition-wise registrations
Examination Statistics
Attempted
Not attempted
Completed
Passed
Failed
Average score
Highest score
Lowest score
Donation Statistics
Daily donation
Monthly donation
Yearly donation
Donation by purpose
Number of donors
22. DATA EXPORT SYSTEM
Admin should be able to export data.
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
17
Formats:
CSV
Excel/XLSX
PDF where appropriate
Admin can select:
Students
Registrations
Exams
Results
Donations
Certificates
Attendance
Oral examination
Audit logs
Add filters before export.
Example:
Date:
01/09/2026 → 30/09/2026
Competition:
Vedic Knowledge Competition
State:
Uttar Pradesh
Then:
Export CSV
Sensitive fields such as Aadhaar and bank information must be excluded by default and only exportable
by explicitly authorized roles.
Every sensitive export should be logged.
23. ADMIN STUDENT MANAGEMENT
Admin can search students.
•
•
•
•
•
•
•
•
•
•
•
•
18
Search by:
Registration number
Name
Mobile
Email
District
Competition
Admin can view:
Profile
Documents
Registration
Exam status
Results
Certificates
Payment information
Admin can edit incorrect information.
When admin changes important information:
Record:
Old value
New value
Admin ID
Date/time
Reason
This creates an audit trail.
24. ADMIN ROLES
Create multiple roles.
Super Admin
Full access.
Admin
Student and competition management.
Exam Admin
Exam/question management.
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
19
Examiner
Oral evaluation and results.
Finance Admin
Donation and receipt management.
Content Admin
Website/news/gallery management.
Library Admin
Library management.
Use RBAC middleware.
Example:
SUPER_ADMIN
ADMIN
EXAM_ADMIN
EXAMINER
FINANCE_ADMIN
CONTENT_ADMIN
LIBRARY_ADMIN
STUDENT
25. ADMIN USER MANAGEMENT
Super Admin can:
Create admin
Disable admin
Change role
Reset password
View login history
Revoke sessions
Do not allow normal admins to modify their own privilege level.
26. EMAIL SYSTEM
Implement automated email notifications.
•
•
•
•
•
•
20
Use a reliable transactional email provider or SMTP.
Emails:
Registration
"Registration Successful"
Email Verification
"Verify your email"
Password Reset
"Reset your password"
Exam Reminder
"Your examination is approaching"
Admit Card
"Your admit card is available"
Result
"Your result has been published"
Certificate
"Your certificate is ready"
Donation
"Donation received"
Receipt
"Your donation receipt is attached/available"
Admin Notification
"New registration received"
Create reusable email templates.
21
27. ONLINE RECEIPT SYSTEM
Generate receipts automatically.
Receipt contains:
Receipt number
Name
Amount
Date
Payment method
Transaction ID
Purpose
Gurukul information
Authorized signature
QR code if required
Allow:
Download Receipt PDF
Store receipt metadata in database.
28. LIBRARY PORTAL
Create a separate Library Portal.
Route:
/library
Students can search:
Books
Sanskrit books
Vedic literature
Notes
PDFs
Study materials
Videos
Articles
Features:
Search
Categories
Authors
Subjects
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
22
Digital books
Download
Reading status
Admin can:
Add books
Edit books
Delete books
Upload PDFs
Manage categories
Track downloads
If physical library functionality is needed, add:
Book issue
Return
Due date
Fine
Student library card
29. NOTIFICATION SYSTEM
Create notification center.
Notifications can be:
Exam announcement
Registration confirmation
Exam reminder
Result published
Certificate available
Important Gurukul announcement
Admin can send notifications to:
All students
Specific competition
Specific class
Specific district
Selected students
30. NOTICE BOARD
Admin can create:
Notices
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
23
Announcements
Exam updates
Competition updates
Holiday notices
Each notice should contain:
Title
Description
Date
Attachment
Publish/unpublish
Expiry date
31. GALLERY MANAGEMENT
Admin can upload:
Event photos
Competition photos
Gurukul activities
Videos
Features:
Category
Caption
Date
Publish/unpublish
32. CONTACT SYSTEM
Create contact form:
Name
Email
Mobile
Subject
Message
Admin can view and respond.
Add spam protection/rate limiting.
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
24
33. DATABASE DESIGN
Use PostgreSQL + Prisma.
Create relational tables such as:
users
roles
permissions
students
student_documents
student_addresses
student_education
student_bank_details
competitions
competition_categories
registrations
registration_documents
exam_sessions
exam_questions
exam_options
exam_answers
oral_questions
oral_submissions
oral_evaluations
results
certificates
certificate_verifications
donations
donation_receipts
payments
notifications
notices
gallery
library_books
library_categories
library_downloads
admins
audit_logs
login_logs
email_logs
file_uploads
Use proper:
Primary keys
Foreign keys
Unique constraints
Indexes
•
•
•
•
25
Timestamps
Soft deletion where appropriate
34. IMPORTANT DATABASE RELATIONSHIPS
Example:
User
 ↓
Student
 ↓
Registration
 ↓
Competition
 ↓
Exam Session
 ↓
Exam Answers
 ↓
Result
 ↓
Certificate
For oral examination:
Student
 ↓
Registration
 ↓
Oral Exam
 ↓
Video Submission
 ↓
Examiner Evaluation
 ↓
Final Result
35. JWT AUTHENTICATION
Implement secure JWT authentication.
Recommended architecture:
•
•
26
Access Token
Short lifetime
Refresh Token
Longer lifetime
Refresh tokens should be securely stored and revocable.
Implement middleware:
authenticateUser()
requireRole()
requirePermission()
Example:
/admin/students
requires authentication and appropriate admin permission.
36. SECURITY REQUIREMENTS
Security is extremely important because the application handles identity, financial and examination
information.
Implement:
Password hashing
JWT authentication
RBAC
HTTPS in production
Helmet
CORS
Rate limiting
CSRF protection where applicable
Input validation
SQL injection protection through Prisma/parameterized queries
XSS protection
Secure cookies where used
File upload validation
File size limits
Audit logs
Login attempt monitoring
Account lock/rate limiting
Password reset security
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
27
Email verification
Session revocation
Never log:
Passwords
Full authentication tokens
Sensitive identity numbers
Bank account numbers
Sensitive data should be masked in logs and UI.
37. PRIVACY
Because the platform collects identity and financial information:
Create:
Privacy Policy
Terms & Conditions
Consent mechanism
Data retention policy
Data access controls
Audit logs
Only collect information that is actually necessary.
Sensitive data should be encrypted or protected appropriately.
38. RESPONSIVE DESIGN
The website must work on:
Desktop
Laptop
Tablet
Android
iPhone
Admin dashboard should also be responsive.
Exam portal should work especially well on desktop and modern mobile browsers if mobile examination
is permitted.
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
28
39. UI COMPONENTS
Create reusable components:
Navbar
Footer
Hero
Button
Modal
Form
Input
Select
DatePicker
FileUpload
Table
Pagination
Search
Filter
Card
StatsCard
Chart
Sidebar
DashboardLayout
LoadingSpinner
Toast
ConfirmationDialog
PDFViewer
VideoPlayer
ExamTimer
QuestionNavigation
40. API STRUCTURE
Use REST APIs.
Example:
/api/auth/register
/api/auth/login
/api/auth/logout
/api/auth/refresh
/api/auth/forgot-password
/api/students/profile
/api/students/documents
29
/api/competitions
/api/competitions/:id/register
/api/exams
/api/exams/:id/start
/api/exams/:id/questions
/api/exams/:id/answers
/api/exams/:id/submit
/api/oral/questions
/api/oral/submissions
/api/oral/evaluate
/api/results
/api/certificates
/api/certificates/verify
/api/donations
/api/donations/:id/receipt
/api/library
/api/library/books
/api/admin/students
/api/admin/registrations
/api/admin/exams
/api/admin/results
/api/admin/donations
/api/admin/statistics
/api/admin/exports
/api/admin/audit-logs
41. SEARCH AND FILTERING
Admin tables must have:
Search
Sort
Pagination
Filters
Date ranges
Export
For large datasets use server-side pagination.
Do not load thousands of records into the browser at once.
•
•
•
•
•
•
30
42. AUDIT LOG
Every important admin action should be recorded.
Example:
Admin:
Admin ID
Action:
UPDATE_STUDENT
Entity:
Student
Old Data:
...
New Data:
...
Reason:
Correction requested by student
Timestamp:
...
IP:
...
Audit logs should be accessible only to authorized administrators.
43. EXAM QUESTION ADMIN PANEL
Admin can:
Create question
Edit question
Delete question
Import questions
Export questions
Add images
Set marks
Set negative marks
Set difficulty
Assign subject
Publish/unpublish
•
•
•
•
•
•
•
•
•
•
•
31
Allow bulk question import using CSV/XLSX.
44. EXAM CREATION
Admin should be able to create:
Competition
 ↓
Exam
 ↓
Sections
 ↓
Questions
Example:
Vedic Knowledge Competition 2026
Section 1:
Sanskrit
Section 2:
Vedas
Section 3:
Indian Culture
Section 4:
General Knowledge
45. EXAM ATTEMPT RULES
Admin can configure:
One attempt
Multiple attempts
Start date
End date
Duration
Passing score
Negative marking
Random questions
Once submitted:
•
•
•
•
•
•
•
•
32
The attempt should become locked unless an authorized admin resets it.
46. RESULT RANKING
Automatically calculate rank.
Handle ties correctly.
Example:
Rank 1
Rank 2
Rank 2
Rank 4
Admin should be able to manually override results with an audit log.
47. QR CODE SYSTEM
Use QR codes for:
Registration confirmation
Admit card
Certificate
Donation receipt
QR code should point to a secure verification page.
48. SEO
Public website should have:
SEO-friendly URLs
Meta titles
Meta descriptions
Open Graph metadata
Sitemap
Robots.txt
Structured data where appropriate
Do not expose student/private portal information to search engines.
•
•
•
•
•
•
•
•
•
•
•
33
49. PERFORMANCE
Optimize:
Image compression
Lazy loading
Code splitting
API pagination
Database indexing
Caching where appropriate
CDN/object storage for large files
Videos should not be served directly from the Node.js server if object storage/CDN is available.
50. ERROR HANDLING
Create professional error pages:
404
403
500
Network error
Unauthorized
Session expired
Use friendly messages.
Never expose stack traces to users in production.
51. PROJECT STRUCTURE
Use a clean monorepo or organized project structure.
Example:
gurukul-platform/
├── client/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── layouts/
│ │ ├── hooks/
│ │ ├── services/
│ │ ├── context/
•
•
•
•
•
•
•
•
•
•
•
•
•
34
│ │ ├── utils/
│ │ └── routes/
│
├── server/
│ ├── src/
│ │ ├── controllers/
│ │ ├── routes/
│ │ ├── middleware/
│ │ ├── services/
│ │ ├── validators/
│ │ ├── utils/
│ │ ├── config/
│ │ └── app.js
│
├── prisma/
│ ├── schema.prisma
│ ├── migrations/
│ └── seed.js
│
├── uploads/
│
├── docs/
│
├── .env.example
├── README.md
└── package.json
52. ENVIRONMENT VARIABLES
Create .env.example .
Example:
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
35
PAYMENT_GATEWAY_KEY=
PAYMENT_GATEWAY_SECRET=
FRONTEND_URL=
BACKEND_URL=
Never commit actual secrets.
53. ADMIN DASHBOARD SIDEBAR
Create sidebar:
Dashboard
Students
Registrations
Competitions
Exams
Questions
Oral Exams
Results
Certificates
Donations
Receipts
Library
Notices
Gallery
Website Content
Statistics
Reports
Exports
Admins
Roles & Permissions
Audit Logs
System Settings
36
54. STUDENT SIDEBAR
Dashboard
My Profile
My Registration
Documents
Admit Card
Examination
Oral Examination
Result
Certificate
Receipts
Library
Notifications
Help
Logout
55. HOME PAGE COMPETITION CTA
The upcoming competition should be prominently displayed.
Example:
UPCOMING COMPETITION
Maharishi Panini Ved Vedang Competition 2026
Registration Open
Last Date:
XX/XX/2026
Examination:
XX/XX/2026
[Register Now]
Dates must be dynamically controlled by Admin.
56. REGISTRATION STATUS
Show:
37
Registration Submitted
 ↓
Documents Verification
 ↓
Approved
 ↓
Admit Card Generated
 ↓
Exam Scheduled
 ↓
Exam Completed
 ↓
Result Published
 ↓
Certificate Generated
Student should be able to see the current status.
57. ADMIN REGISTRATION VERIFICATION
Admin can:
Approve
Reject
Request correction
View documents
Add remarks
Student receives notification/email when status changes.
58. EMAIL VERIFICATION
Registration should preferably require verified email/mobile depending on the operational
requirement.
Do not activate sensitive student functionality until verification is completed.
59. PASSWORD RESET
Implement secure password reset.
Process:
•
•
•
•
•
38
Forgot Password
 ↓
Email
 ↓
Secure temporary token
 ↓
Reset Password
 ↓
Token invalidated
Never send passwords by email.
60. TESTING
Create tests for:
Backend
Authentication
Registration
Student CRUD
Competition
Exam
Results
Donations
Permissions
Frontend
Forms
Login
Registration
Exam
Dashboard
Security
Test:
Unauthorized access
Role escalation
Invalid JWT
Expired JWT
File upload attacks
SQL injection
XSS
Rate limiting
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
39
61. SEED DATA
Create development seed data.
Create:
Super Admin
email:
admin@example.com
Use a development-only password configured through environment variables.
Create sample:
Students
Competition
Questions
Exam
Results
Library books
Notices
Never use real Aadhaar/bank data in seed data.
62. DOCUMENTATION
Create complete README.
Include:
Project overview
Architecture
Installation
Environment variables
PostgreSQL setup
Prisma setup
Database migration
Seed database
Development
Production build
Deployment
Storage configuration
Email configuration
Payment configuration
Security considerations
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
40
63. DEVELOPMENT APPROACH
Do not attempt to create the entire system as one giant unstructured file.
Build modularly.
Recommended development order:
Phase 1
Project setup
Phase 2
Database + Prisma
Phase 3
Authentication + JWT
Phase 4
Public website
Phase 5
Student registration
Phase 6
Student dashboard
Phase 7
Competition management
Phase 8
MCQ examination
Phase 9
Oral/video examination
Phase 10
Results + certificates
41
Phase 11
Admin ERP
Phase 12
Statistics + exports
Phase 13
Donation + receipts
Phase 14
Library portal
Phase 15
Email notifications
Phase 16
Security hardening
Phase 17
Testing
Phase 18
Deployment
64. IMPORTANT UX REQUIREMENT
The website must be easy for students and parents who may not be highly technical.
Use:
Simple Hindi/English labels
Clear instructions
Progress indicators
Helpful validation messages
Large buttons
Mobile-friendly forms
Save-progress functionality where appropriate
Consider supporting:
English + Hindi
•
•
•
•
•
•
•
42
Design the application so additional languages can be added later.
65. FINAL REQUIREMENT
Build this as a real production-grade ERP and competition examination platform, not as a simple
demo website.
The final application must have:
Clean architecture
Secure authentication
PostgreSQL database
Prisma ORM
MERN-style React + Node/Express architecture
JWT
RBAC
Student portal
Admin ERP
Competition portal
MCQ examination
Oral/video examination
Results
Certificates
Donation
Receipts
Email notifications
Library portal
Statistics
Data export
Audit logs
Document management
Responsive UI
Security
Validation
Testing
Documentation
Before considering the project complete, verify that all major workflows work end-to-end:
Student Registration
 ↓
Email Confirmation
 ↓
Admin Verification
 ↓
Registration Approval
 ↓
Admit Card
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
•
43
 ↓
MCQ Examination
 ↓
Oral Video Examination
 ↓
Examiner Evaluation
 ↓
Final Result
 ↓
Rank
 ↓
Certificate
 ↓
Certificate Verification
And:
Donor
 ↓
Donation
 ↓
Payment Confirmation
 ↓
Receipt Generation
 ↓
Email
 ↓
Receipt Download
And:
Admin
 ↓
Dashboard
 ↓
Statistics
 ↓
Search/Filter
 ↓
Edit Student
 ↓
Audit Log
 ↓
Export Data
The final UI should look like a professional educational institution ERP, while preserving the
traditional identity of Maharishi Panini Ved Vedang Gurukul.
44