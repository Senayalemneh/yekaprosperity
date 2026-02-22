import React from "react";

const AdminDashboard = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        Yeka Sub City Administration Dashboard
      </h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
        <div className="p-4 bg-gray-200 border-b border-gray-300">
          <h2 className="text-xl font-bold">Main Functionalities</h2>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">1. Home Page</h3>
            <p className="text-gray-700">
              Manage the main content visible to visitors on the home page of
              the Yeka Sub City Administration website.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">2. User Feedback</h3>
            <p className="text-gray-700">
              View and respond to feedback submitted through the website's
              contact page, ensuring effective communication with the public.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">3. Add News</h3>
            <p className="text-gray-700">
              Add and manage news articles and updates to keep residents
              informed about recent developments and events in Yeka Sub City.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">4. Add Director Message</h3>
            <p className="text-gray-700">
              Publish messages from the administration’s director to communicate
              important announcements and updates to the community.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">5. Add Image Gallery</h3>
            <p className="text-gray-700">
              Upload and manage images on the Gallery page to showcase events,
              activities, and initiatives of Yeka Sub City.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">6. Add Tenders</h3>
            <p className="text-gray-700">
              Add and manage tenders to ensure transparency and provide
              information on procurement opportunities within Yeka Sub City.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">7. Add Vacancies</h3>
            <p className="text-gray-700">
              Post and update job vacancies to attract qualified candidates for
              positions within the Yeka Sub City administration.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">8. Add Events</h3>
            <p className="text-gray-700">
              Manage and promote events organized by the Yeka Sub City
              administration to keep the community engaged and informed.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">9. View Complaints</h3>
            <p className="text-gray-700">
              Access and review complaints submitted by residents to address
              their concerns and improve service delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
