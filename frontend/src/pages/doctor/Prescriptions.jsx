// src/pages/doctor/Prescriptions.jsx
import React, { useState, useEffect } from 'react';
import api from '../../axios-config';
import { format } from 'date-fns';
import {
  ClipboardDocumentCheckIcon,
  UserIcon,
  CalendarIcon,
  PencilIcon,
  XMarkIcon,
  ArrowPathIcon,
  XCircleIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon // Add this line
} from '@heroicons/react/24/outline';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await api.get('/api/doctor/prescriptions/');
            // setPrescriptions(response.data);
      // setPrescriptions(response.data.prescriptions || []);
      setPrescriptions(response.data.results || []);
      console.log('Prescriptions response:', response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError('Failed to load prescriptions');
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const handleSelectPrescription = (prescription) => {
    setSelectedPrescription(prescription);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <ArrowPathIcon className="h-12 w-12 animate-spin text-teal-500 mb-4" />
          <div className="text-gray-600">Loading prescriptions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">Error loading prescriptions</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <ClipboardDocumentCheckIcon className="h-8 w-8 text-teal-500 mr-2" />
        Prescriptions
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prescriptions List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <ClipboardDocumentListIcon className="h-5 w-5 text-teal-500 mr-2" />
              All Prescriptions
            </h2>
            
            {Array.isArray(prescriptions) && prescriptions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No prescriptions found
              </div>
            ) : (
              <div className="space-y-4">
                {Array.isArray(prescriptions) && prescriptions.map((prescription) => (
                  <div 
                    key={prescription.id}
                    className={`border border-gray-200 rounded-lg p-4 transition-all duration-200 ${
                      selectedPrescription?.id === prescription.id 
                        ? 'ring-2 ring-teal-500 bg-teal-50' 
                        : 'bg-white hover:shadow-md cursor-pointer'
                    }`}
                    onClick={() => handleSelectPrescription(prescription)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-teal-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            Patient ID: {prescription.patient}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Issued: {formatDate(prescription.date_issued)}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <PencilIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="mt-3 pl-13">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Medication:</span> {prescription.medication}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Prescription Details */}
        {selectedPrescription && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <BeakerIcon className="h-5 w-5 text-teal-500 mr-2" />
                  Prescription Details
                </h2>
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-teal-50 rounded-lg">
                  <p className="text-sm font-medium text-teal-800">
                    Patient ID: {selectedPrescription.patient}
                  </p>
                  <p className="text-xs text-teal-600 mt-1">
                    Issued: {formatDate(selectedPrescription.date_issued)}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <UserIcon className="h-4 w-4 mr-1 text-gray-500" />
                    Patient
                  </h3>
                  <p className="mt-1 text-gray-800">{selectedPrescription.patient}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                    Date Issued
                  </h3>
                  <p className="mt-1 text-gray-800">{formatDate(selectedPrescription.date_issued)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <ClipboardDocumentCheckIcon className="h-4 w-4 mr-1 text-gray-500" />
                    Symptoms
                  </h3>
                  <p className="mt-1 text-gray-800">{selectedPrescription.symptoms}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <BeakerIcon className="h-4 w-4 mr-1 text-gray-500" />
                    Medication
                  </h3>
                  <p className="mt-1 text-gray-800">{selectedPrescription.medication}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <PencilIcon className="h-4 w-4 mr-1 text-gray-500" />
                    Dosage
                  </h3>
                  <p className="mt-1 text-gray-800">{selectedPrescription.dosage}</p>
                </div>
                
                {selectedPrescription.instructions && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 flex items-center">
                      <DocumentTextIcon className="h-4 w-4 mr-1 text-gray-500" />
                      Instructions
                    </h3>
                    <p className="mt-1 text-gray-800">{selectedPrescription.instructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
/*


✅ Problem:
You're not seeing anything rendered in the UI, even though the response contains the prescription data.

The Culprit:
You're using this line in your `fetchPrescriptions` function:

```js
setPrescriptions(response.data.prescriptions || []);
```

But your actual response shape from the console is:
```js
{
  count: 1,
  next: null,
  previous: null,
  results: [ ... ]  // <- your prescriptions are here
}
```

So `response.data.prescriptions` is `undefined`, and you're always setting `prescriptions` to an empty array!

---

### ✅ Fix:
Replace this line:
```js
setPrescriptions(response.data.prescriptions || []);
```

With this:
```js
setPrescriptions(response.data.results || []);
```

---

### ✨ Bonus Tip:
You might also want to add pagination later using `count`, `next`, and `previous`, but for now just showing the `results` should fix your immediate issue.

Let me know if you want help adding pagination too or showing more patient details from the prescription.


*/