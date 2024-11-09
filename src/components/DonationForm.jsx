import { React, useState } from "react";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { AWS_CONFIG } from '../config/aws-config';
import './DonationForm.css';

// Initialize AWS clients with proper configuration
const s3Client = new S3Client(AWS_CONFIG);
const ddbClient = new DynamoDBClient(AWS_CONFIG);
const docClient = DynamoDBDocumentClient.from(ddbClient);

// Function to generate UUID using crypto API
function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export default function DonationForm() {
  const [donation, setDonation] = useState({
    type: '',
    quantity: '',
    description: '',
    image: null,
    name: '',
    mobileNumber: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDonation(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setDonation(prev => ({ ...prev, image: file }));
  };

  const uploadImageToS3 = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${generateUUID()}.${fileExt}`;

    const uploadParams = {
      Bucket: AWS_CONFIG.bucketName,
      Key: fileName,
      Body: file,
      ContentType: file.type,
    };

    try {
      await s3Client.send(new PutObjectCommand(uploadParams));
      return fileName;
    } catch (err) {
      console.error("Error uploading to S3:", err);
      throw new Error(`Failed to upload image: ${err.message}`);
    }
  };

  const saveToDynamoDB = async (donationData) => {
    const params = {
      TableName: "Donations",
      Item: {
        donationId: generateUUID(),
        type: donationData.type,
        quantity: donationData.quantity,
        description: donationData.description,
        imageUrl: donationData.imageUrl,
        name: donationData.name,
        mobileNumber: donationData.mobileNumber,
        address: donationData.address,
        createdAt: new Date().toISOString()
      }
    };

    try {
      await docClient.send(new PutCommand(params));
    } catch (err) {
      console.error("Error saving to DynamoDB:", err);
      throw new Error(`Failed to save donation details: ${err.message}`);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!donation.type || !donation.quantity || !donation.image || !donation.name || !donation.mobileNumber) {
        throw new Error("Please fill in all required fields and upload an image");
      }

      // Upload image to S3
      const imageUrl = await uploadImageToS3(donation.image);

      // Save to DynamoDB
      await saveToDynamoDB({
        ...donation,
        imageUrl
      });

      // Reset form
      setDonation({
        type: '',
        quantity: '',
        description: '',
        image: null,
        name: '',
        mobileNumber: '',
        address: ''
      });

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      alert("Donation submitted successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-3" id="donation-form">
      <div className="form-container">
        <h1 className="form-heading">Donation Form</h1>
        <form style={{ margin: "40px auto" }} onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form-group">
            <label>Name</label>
            <input
              className="form-control my-3"
              name="name"
              value={donation.name}
              onChange={handleChange}
              type="text"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              className="form-control my-3"
              name="mobileNumber"
              value={donation.mobileNumber}
              onChange={handleChange}
              type="number"
              placeholder="Enter your mobile number"
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              className="form-control my-3"
              name="address"
              value={donation.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>

          <div className="form-group">
            <label>Product Type</label>
            <select
              className="form-control my-3"
              name="type"
              value={donation.type}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Electronic">Electronic</option>
              <option value="Paper/Newspaper">Paper/Newspaper</option>
              <option value="Plastic">Plastic</option>
              <option value="Metal">Metal</option>
              <option value="Glass">Glass</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              className="form-control my-3"
              name="quantity"
              value={donation.quantity}
              onChange={handleChange}
              type="number"
              placeholder="Quantity / Weight in Kgs"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control my-3"
              name="description"
              value={donation.description}
              placeholder="Description..."
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-5">
            <label>Product Image</label>
            <input
              className="form-control my-3"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>
          <div style={{display: "flex", justifyContent: "center"}}>
            <button
              type="submit"
              className="btn btn-outline-dark submit-btn"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Donation'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}