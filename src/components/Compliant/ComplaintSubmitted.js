import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const ComplaintSubmitted = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const complaintId = location.state?.complaintId;

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="mt-3 text-3xl font-bold text-gray-900">Complaint Submitted</h1>
        <p className="mt-4 text-lg text-gray-600">
          Thank you for submitting your complaint. We have received it and will review it shortly.
        </p>
        
        {complaintId && (
          <div className="mt-6 bg-blue-50 p-4 rounded-md">
            <p className="text-sm font-medium text-blue-800">
              Your complaint reference number is: <span className="font-bold">{complaintId}</span>
            </p>
            <p className="mt-2 text-sm text-blue-700">
              Please keep this number for your records and future reference.
            </p>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintSubmitted;