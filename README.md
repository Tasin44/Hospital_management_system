# Hospital Management System
## 📖 About
This project is a Hospital Management System , implemented using Django Rest Framework, React Js , Postgres . It provides a multi-user platform with three user types: admin, doctor, and patient. Each user has role-based access control, with robust authentication, email verification and personalized profiles.Implemented modules for appointment scheduling, patient management, billing, bed allocation , emergency management . 

## ✨ Features:
+ Multi-user Platform: Admin, Doctor & Patient roles with specific permissions.
+ Role-based Access Control: Different functionalities available based on user roles.
+ Email Verification: Ensures users are authenticated through email verification.
+ Personalized Profiles: Patients and Doctor can view their own profiles, info and updates.
+ Administrative Updates: Admin can update Patient and Doctor information , Bed allocation, Emergency handling, Creating invoice , Discharge details .
+ Roles:
  + Admin: Manages the entire system.
  + Doctor: Manages patients, appointments, and prescriptions.
  + Patient: Books appointments, views medical history, and manages personal details.

## 🛠️ Tools and Technologies:
+ Frontend: HTML, Tailwind CSS, React JS
+ Backend : Python , Django Rest Framework
+ Database: PostgreSQL

## 📋Setup Instructions to Run
Follow these steps to set up the project on your local machine.

Prerequisites (Install)
+ Python 3.x
+ Django 3.x
+ A SQL database (e.g., SQLite, PostgreSQL)
+ Git

## 🚀 Run:
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
4.Database Setup Create a PostgreSQL database and update your settings.py:
```bash
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_db_name',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```
5. 🔧 Email Configuration:

Update your settings.py for email functionality:
```
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your_email@gmail.com'
EMAIL_HOST_PASSWORD = 'your_app_password'
DEFAULT_FROM_EMAIL = 'your_email@gmail.com'
```
6. Media Files Configuration:
```
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```
7.Apply migrations:
```bash
python manage.py migrate
```
6. Create a superuser:
```
python manage.py createsuperuser
```
7.Run the development server:
```bash
python manage.py runserver
```
8.Access the application: Open your web browser and navigate to http://127.0.0.1:8000/.


## Frontend Setup (React):

9.Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```
10.Install frontend dependencies:
```bash
npm install
```
11.Start the React development server:
```bash
npm run dev
```
12.Access the frontend:
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


### Doctor's Assigned Patients
![image](https://github.com/user-attachments/assets/60cf016e-311f-4c41-b59b-54e5ab91cd5d)


## Patient 

### Patient's Dashboard
![image](https://github.com/user-attachments/assets/26acefb8-6d67-4d97-8593-bb25c4ced786)


### Patient's Profile 
![unnamed](https://github.com/user-attachments/assets/eeb47065-9d70-4aea-a2ea-1d6cd3abb79d)


### Patient's Discharge Details 
![image](https://github.com/user-attachments/assets/a04a35c9-45ed-43de-bd7e-827e3468a661)


### Invoices
![image](https://github.com/user-attachments/assets/6a85a1bb-f7cd-4b38-80ff-b1eec7e9ff7a)


### Search Doctor
![image](https://github.com/user-attachments/assets/fb3ff3a1-5808-4b2f-8d88-90c54f329a4c)

## 🤝 Contributing:

* Fork the repository
* Create a feature branch (git checkout -b feature/AmazingFeature)
* Commit your changes (git commit -m 'Add some AmazingFeature')
* Push to the branch (git push origin feature/AmazingFeature)
* Open a Pull Request
