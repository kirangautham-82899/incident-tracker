import jsPDF from 'jspdf';

export const generateIncidentPDF = (incident) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185); // Blue
    doc.text("Incident Report", margin, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, 28);

    // Line separator
    doc.setDrawColor(200);
    doc.line(margin, 32, pageWidth - margin, 32);

    // Incident Details
    let yPos = 45;

    const addField = (label, value) => {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(label.toUpperCase(), margin, yPos);

        doc.setFontSize(12);
        doc.setTextColor(0);

        // Handle long text wrapping
        const splitText = doc.splitTextToSize(value || 'N/A', pageWidth - (margin * 2));
        doc.text(splitText, margin, yPos + 6);

        yPos += (splitText.length * 6) + 12;
    };

    // Basic Info
    addField("Incident ID", incident._id);
    addField("Title", incident.title);
    addField("Type", incident.type.toUpperCase());

    // Status Badge logic simulation in text
    doc.setTextColor(incident.status === 'resolved' ? '0, 128, 0' : '255, 0, 0');
    addField("Status", incident.status.toUpperCase());

    // Location
    addField("Location", incident.location?.address || 'Coordinates Only');

    // Description
    addField("Description", incident.description);

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Confidential - For Official Use Only", pageWidth / 2, footerY, { align: "center" });

    // Save
    doc.save(`incident-report-${incident._id.slice(-6)}.pdf`);
};

export const generateDashboardPDF = (stats, recentIncidents) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185); // Blue
    doc.text("Command Center Status Report", margin, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, 28);

    // Line separator
    doc.setDrawColor(200);
    doc.line(margin, 32, pageWidth - margin, 32);

    // Stats Grid
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("System Metrics", margin, 45);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Total Incidents: ${stats.total}`, margin, 55);
    doc.text(`Active Cases: ${stats.active}`, margin, 60);
    doc.text(`Critical Alerts: ${stats.critical}`, margin, 65);
    doc.text(`Resolved: ${stats.resolved}`, margin, 70);

    // Recent Activity
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Recent Activity Log", margin, 85);

    let yPos = 95;
    recentIncidents.slice(0, 5).forEach((incident, index) => {
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(`${index + 1}. ${incident.title} (${incident.type.toUpperCase()})`, margin, yPos);

        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(`   Status: ${incident.status.toUpperCase()} | Rep: ${incident.reporter?.name || 'Anon'}`, margin, yPos + 5);

        yPos += 12;
    });

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Official System Generation - Confidential", pageWidth / 2, footerY, { align: "center" });

    doc.save(`system-status-${new Date().toISOString().slice(0, 10)}.pdf`);
};
