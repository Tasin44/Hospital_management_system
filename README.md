# Hospital Management System
## About the Project
This project is a Hospital Management System , implemented using Django Rest Framework, React Js , Postgres . It provides a multi-user platform with three user types: admin, doctor, and patient. Each user has role-based access control, with robust authentication, email verification and personalized profiles.Implemented modules for appointment scheduling, patient management, billing, bed allocation , emergency management . 

### Features:
+ Multi-user Platform: Admin, Doctor & Patient roles with specific permissions.
+ Role-based Access Control: Different functionalities available based on user roles.
+ Email Verification: Ensures users are authenticated through email verification.
+ Personalized Profiles: Patients and Doctor can view their own profiles, info and updates.
+ Administrative Updates: Admin can update Patient and Doctor information , Bed allocation, Emergency handling, Creating invoice , Discharge details .
+ Roles:
  + Admin: Manages the entire system.
  + Doctor: Manages patients, appointments, and prescriptions.
  + Patient: Books appointments, views medical history, and manages personal details.

### Tools and Technologies:
+ Frontend: HTML, Tailwind CSS, React JS
+ Backend : Python , Django Rest Framework
+ Database: PostgreSQL

### Setup Instructions to Run
Follow these steps to set up the project on your local machine.

#### Prerequisites (Install)
+ Python 3.x
+ Django 3.x
+ A SQL database (e.g., SQLite, PostgreSQL)
+ Git

## Run
1.Clone the repository:
```bash
git clone https://github.com/Tasin44/Hospital_management_system.git
```
2.Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate # (terminal)  # On Windows use `venv\Scripts\activate`
```
3.Install the required packages:
```bash
pip install -r requirements.txt
```
4.To set up built-in db.sqlite3, configure the database settings in settings.py:
```bash
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```
5.Apply migrations:
```bash
python manage.py migrate
```
6.Run the development server:
```bash
python manage.py runserver
```
7.Access the application: Open your web browser and navigate to http://127.0.0.1:8000/.

## Frontend Setup (React):

8.Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```
9.Install frontend dependencies:
```bash
npm install
```
10.Start the React development server:
```bash
npm run dev
```
11.Access the frontend:
Open your browser and go to: http://localhost:5173/signup


## Project Flow and Frontend View:
### Signup
![Screenshot (31)](https://github.com/user-attachments/assets/fe9746f0-40f8-4f68-ab52-b6cc95e0f6c3)

### Login for Doctor
















