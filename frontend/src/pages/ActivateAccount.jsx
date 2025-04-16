// src/pages/ActivateAccount.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ActivateAccount = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('');

  // useEffect(() => {
  //   fetch(`http://localhost:8000/api/activate/${token}/`)
  //     .then(res => res.json())
  //     .then(data => setMessage(data.message))
  //     .catch(() => setMessage("Activation failed."));
  // }, [token]);
  useEffect(() => {
    fetch(`http://localhost:8000/api/activate/${token}/`)
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        alert('Account activated successfully!');
        navigate('/login'); // 🔁 Redirect to login
      })
      .catch(() => {
        setMessage("Activation failed.");
        alert('Activation failed!');
      });
  }, [token, navigate]);
  return (
    <div className="max-w-md mx-auto p-4 mt-10 text-center">
      <h2 className="text-xl">{message}</h2>
    </div>
  );
};

export default ActivateAccount;
