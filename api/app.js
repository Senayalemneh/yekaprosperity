const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const partnerRoutes = require("./routes/partnerRoutess");

const itemRoutes = require("./routes/itemRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const userRoutess = require("./routes/userRoutess");
const authRoutes = require("./routes/auth");
const officeDataRoutes = require("./routes/officeRoutes");
const directorMessageRoutes = require("./routes/directorMessageRoutes");
const newsRoutes = require("./routes/newsRoutes");
const cabinetMemberRoutes = require("./routes/cabinetMemberRoutes");
const galleryRoute = require("./routes/galleryRoute");
const CEORoutes = require("./routes/CEORoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const vacancyRoutes = require("./routes/vacancyRoutes");
const fileUploadRoutes = require("./routes/fileUploadRoutes");
const tenderRoutes = require("./routes/tenderRoutes");
const eventRoutes = require("./routes/eventRoutes");
const resourceFileRoutes = require("./routes/resourceFileRoutes"); // Importing resource file routes
const quickMessageRoutes = require("./routes/quickMessageRoutes"); // Importing quick message routes
const topPerformerRoutes = require("./routes/topPerformerRoutes"); // Importing top performer routes
const compliantRoutes = require("./routes/complaintRoutes");
const contactRoutes = require("./routes/contactRoutes");
const orgRoutes = require("./routes/orgRoutes");
const faqRoutes = require("./routes/faqRoutes");
const candidateRoutes = require('./routes/candidateRoutes');

//DMS
const folderRoutes = require("./routes/folderRoutes");
const fileRoutes = require("./routes/fileRoutes");
const shareRoutes = require("./routes/shareRoutes");
// const favoriteRoutes = require("./routes/favoriteRoutes");
// const activityRoutes = require("./routes/activityRoutes");
// const partnerRoutes = require('./routes/partnerRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/items", itemRoutes);
app.use("/upload", uploadRoutes);
app.use("/users", userRoutess);
app.use("/api", authRoutes);
app.use("/api/officedata", officeDataRoutes);
app.use("/api/directormessage", directorMessageRoutes);
app.use("/api/news", newsRoutes); // Changed from "/api/add-news" to "/api/news"
app.use("/api/add-cabinet", cabinetMemberRoutes); // Changed from "/api/add-cabinet"
app.use("/api/add-gallery", galleryRoute); // Changed from "/api/add-gallery"
app.use("/api/add-ceo", CEORoutes); // Changed from "/api/add-ceo"
app.use("/api/resources", resourceRoutes);
app.use("/api/vacancies", vacancyRoutes);
app.use("/api/upload-file", fileUploadRoutes);
app.use("/api/tenders", tenderRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/resource-files", resourceFileRoutes); // Using the new resource file routes
app.use("/api/quick-messages", quickMessageRoutes); // Using the new quick message routes
app.use("/api/top-performers", topPerformerRoutes); // Using the new top performer routes
app.use("/api/contacts", contactRoutes);
app.use("/api/complaints", compliantRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/org-structures", orgRoutes);
app.use("/api/faq", faqRoutes);
app.use('/api/candidates', candidateRoutes);

// DMS routes

app.use("/api/dms/folders", folderRoutes);
app.use("/api/dms/files", fileRoutes);
app.use("/api/dms/shares", shareRoutes);
// app.use("/api/dms/favorites", favoriteRoutes);
// app.use("/api/dms/activities", activityRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
