const PDFDocument = require("pdfkit");
const fs = require("fs");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const { ulid } = require("ulid");

const fileName = "My PDF Document.pdf";

module.exports.hello = async (event) => {
  try {
    console.log("pdfFuller");

    const doc = new PDFDocument();
    doc.text("My PDF Document", { align: "center" });
    doc.text("This is the body text of the PDF document.");
    doc.text("Footer", { align: "center" });

    // Generate the PDF as a buffer
    const buffer = await new Promise((resolve, reject) => {
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
      doc.end();
    });

    const params = {
      Bucket: "pdf-test-shariq",
      Key: `PDF/${ulid()}.pdf`,
      Body: buffer,
    };

    const resp = await s3.putObject(params).promise();
    console.log("File uploaded successfully to S3", JSON.stringify(resp));

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Go Serverless v1.0! Your function executed successfully!",
        },
        null,
        2
      ),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: error.message,
          input: event,
        },
        null,
        2
      ),
    };
  }
};
