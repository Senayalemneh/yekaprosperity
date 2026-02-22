import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from "../../utils/getApiUrl"; // Get API URL

const QuickMessageDisplay = () => {
  let apiUrl = getApiUrl();
  const [quickMessages, setQuickMessages] = useState([]);

  useEffect(() => {
    fetchQuickMessages();
  }, []);

  const fetchQuickMessages = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/quickMessages`);
      setQuickMessages(response.data);
    } catch (error) {
      console.error('Error fetching quick messages:', error);
    }
  };

  return (
    <div className="overflow-hidden bg-gray-100 p-4 border border-gray-300 rounded">
      <div className="marquee whitespace-nowrap flex">
        {quickMessages.map((msg) => (
          <div key={msg._id} className="marquee-item mx-4">
            {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickMessageDisplay;
