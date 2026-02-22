import React, { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../../utils/getApiUrl";
import { useTranslation } from "react-i18next";

const ContactDashboard = () => {
  const { t } = useTranslation();
  const API_URL = getApiUrl();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("unread");
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, [statusFilter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/contacts?status=${statusFilter}`);
      setContacts(response.data.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_URL}api/contacts/${id}/status`, { status: newStatus });
      fetchContacts();
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(t("contactdashboard.deleteConfirm"))
    ) {
      try {
        await axios.delete(`${API_URL}api/contacts/${id}`);
        fetchContacts();
        if (selectedContact?.id === id) {
          setSelectedContact(null);
        }
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 p-4 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">
            {t("contactdashboard.contactSubmissions")}
          </h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="unread">{t("contactdashboard.status.unread")}</option>
            <option value="read">{t("contactdashboard.status.read")}</option>
            <option value="archived">{t("contactdashboard.status.archived")}</option>
            <option value="">{t("contactdashboard.status.all")}</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {contacts.length === 0 ? (
              <p className="text-gray-500">{t("contactdashboard.noSubmissions")}</p>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-3 border rounded cursor-pointer ${
                    contact.status === "unread"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white"
                  } ${
                    selectedContact?.id === contact.id
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium">{contact.user_name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        contact.status === "unread"
                          ? "bg-blue-100 text-blue-800"
                          : contact.status === "read"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {t(`contactdashboard.status.${contact.status}`)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {contact.contact_info}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(contact.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="w-2/3 p-4 bg-white border-l">
        {selectedContact ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {t("contactdashboard.contactDetails")}
              </h2>
              <div className="space-x-2">
                <select
                  value={selectedContact.status}
                  onChange={(e) =>
                    handleStatusChange(selectedContact.id, e.target.value)
                  }
                  className="p-2 border rounded"
                >
                  <option value="unread">{t("contactdashboard.status.unread")}</option>
                  <option value="read">{t("contactdashboard.status.read")}</option>
                  <option value="archived">{t("contactdashboard.status.archived")}</option>
                </select>
                <button
                  onClick={() => handleDelete(selectedContact.id)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  {t("contactdashboard.delete")}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("contactdashboard.name")}
                </h3>
                <p className="mt-1">{selectedContact.user_name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("contactdashboard.contactInfo")}
                </h3>
                <p className="mt-1">
                  {selectedContact.contact_info.includes("@") ? (
                    <a
                      href={`mailto:${selectedContact.contact_info}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedContact.contact_info}
                    </a>
                  ) : (
                    <a
                      href={`tel:${selectedContact.contact_info}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedContact.contact_info}
                    </a>
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("contactdashboard.submittedOn")}
                </h3>
                <p className="mt-1">
                  {new Date(selectedContact.created_at).toLocaleString()}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("contactdashboard.message")}
                </h3>
                <div className="mt-1 p-3 bg-gray-50 rounded">
                  {selectedContact.message}
                </div>
              </div>

              {selectedContact.evidence && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("contactdashboard.attachment")}
                  </h3>
                  <div className="mt-2">
                    <a
                      href={`${API_URL}${selectedContact.evidence}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {t("contactdashboard.viewAttachment")}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">
              {t("contactdashboard.selectSubmission")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactDashboard;