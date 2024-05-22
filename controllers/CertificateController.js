const knex = require('../database/knex');
const PDFDocument = require('pdfkit');
const fs = require('fs');


// Create a new certificate
exports.createCertificate = async (req, res) => {
  const { userId, subEventId, verificationCode } = req.body;

  try {
    const [certificateId] = await knex('certificates').insert({
      user_id: userId,
      sub_event_id: subEventId,
      verification_code: verificationCode
    });
    res.status(201).json({ id: certificateId });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Get a certificate by ID
exports.getCertificate = async (req, res) => {
  const { id } = req.params;

  try {
    const certificate = await knex('certificates')
      .where({ id })
      .first();
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Get all certificates
exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await knex('certificates').select();
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Update a certificate
exports.updateCertificate = async (req, res) => {
  const { id } = req.params;
  const { userId, subEventId, verificationCode } = req.body;

  try {
    const updated = await knex('certificates')
      .where({ id })
      .update({
        user_id: userId, 
        sub_event_id: subEventId,
        verification_code: verificationCode
      });
    
    if (!updated) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json({ message: 'Certificate updated successfully' });
  } catch (error) {
     res.status(400).json({ error });
  }
};

// Delete a certificate
exports.deleteCertificate = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await knex('certificates')
      .where({ id })
      .del();

    if (!deleted) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Generate certificate PDF
exports.generatePdf = async (req, res) => {

  try {
    const { id } = req.params;

    const certificate = await knex('certificates').where({id}).first();

    if (!certificate) {
      return res.status(404).json({message: 'Certificate not found'});
    }

    const pdfDoc = new PDFDocument();

    pdfDoc.fontSize(25).text(certificate.user.name, 100, 100);
    pdfDoc.fontSize(15).text(certificate.subEvent.name, 100, 150);
    pdfDoc.fontSize(10).text(`Certificate Code: ${certificate.verification_code}`, 100, 200);

    // Add any other elements to PDF

    // Save PDF file
    const pdfPath = `${certificate.id}.pdf`;
    const pdfStream = fs.createWriteStream(pdfPath);
    pdfDoc.pipe(pdfStream);
    pdfDoc.end();
    
    // Return response
    res.download(pdfPath, (err) => {
      if (err) {
        res.status(500).json({message: 'Error downloading PDF'});
      } else {
        fs.unlinkSync(pdfPath); // Delete file after sending
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error generating PDF'});
  }

};

