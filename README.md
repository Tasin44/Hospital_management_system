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
![image](https://github.com/user-attachments/assets/4a54534f-ace9-471e-b895-f0c20389a76a)

### Login 
![image](https://github.com/user-attachments/assets/9092490d-ef6d-40b2-80c1-d52e71190680)

## Doctor
### Doctor's Dashboard
![image](https://github.com/user-attachments/assets/2f0239d4-1df8-4c00-995a-db6e2bfcfca7)

### Doctor's Profile 
![image](https://github.com/user-attachments/assets/213b89ed-d88c-4dcb-9445-96eb9988c6ba)

### Doctor's Appoinments 
![image](https://github.com/user-attachments/assets/78290747-cdff-4271-ada5-f517b43ada16)

### Doctor's Prescriptions 

![image](https://github.com/user-attachments/assets/ab586063-9082-48a5-9d90-b56ab097be3e)

![Screenshot (41)](https://github.com/user-attachments/assets/0147bc39-de79-4d62-8321-7a3606722960)

### Doctor's Assigned Patients
![Screenshot (42)](https://github.com/user-attachments/assets/57795ef7-b9dc-4cb6-9689-1d4f8523f3d6)

## Patient 

### Patient's Dashboard
![Screenshot (43)](https://github.com/user-attachments/assets/3111a0bd-27c7-4ae4-845e-95a4a935d908)

### Patient's Profile 
![unnamed](https://github.com/user-attachments/assets/eeb47065-9d70-4aea-a2ea-1d6cd3abb79d)


### Patient's Discharge Details 
![Screenshot (45)](https://github.com/user-attachments/assets/a62ba928-dd1d-472b-a4de-b3d7bcfe7538)

### Invoices
![Screenshot (46)](https://github.com/user-attachments/assets/37e61f04-c7a8-4134-b430-69f7a818eb6b)

![image](https://github.com/user-attachments/assets/4f68f46c-da1f-4c33-b05a-002d8ee7dded)


### Search Doctor
![Screenshot (47)](https://github.com/user-attachments/assets/add70a17-c5e1-43fa-8b86-9714451d96f1)
