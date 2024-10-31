import React, { useState, useEffect } from 'react';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AWS_CONFIG } from '../config/aws-config';

// Initialize AWS clients
const ddbClient = new DynamoDBClient(AWS_CONFIG);
const docClient = DynamoDBDocumentClient.from(ddbClient);
const s3Client = new S3Client(AWS_CONFIG);

export default function Admin() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to get signed URL for S3 images
  const getImageUrl = async (imageKey) => {
    try {
      const command = new GetObjectCommand({
        Bucket: AWS_CONFIG.bucketName,
        Key: imageKey,
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return url;
    } catch (error) {
      console.error("Error getting signed URL:", error);
      return null;
    }
  };

  // Function to fetch donations from DynamoDB
  const fetchDonations = async () => {
    try {
      const params = {
        TableName: "Donations",
      };
      
      const { Items } = await docClient.send(new ScanCommand(params));
      
      // Get signed URLs for all images
      const donationsWithImages = await Promise.all(
        Items.map(async (donation) => {
          const imageUrl = await getImageUrl(donation.imageUrl);
          return { ...donation, imageUrl };
        })
      );

      setDonations(donationsWithImages);
    } catch (err) {
      console.error("Error fetching donations:", err);
      setError("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle the completion status of a donation
  const toggleCompletion = async (donationId, currentStatus) => {
    try {
      const updatedDonation = {
        ...donations.find(donation => donation.donationId === donationId),
        isCompleted: !currentStatus,
      };
      
      // Here you would update the DynamoDB item with the new completion status
      // This is a placeholder for the update command
      const updateParams = {
        TableName: "donations",
        Key: { donationId },
        UpdateExpression: "set isCompleted = :isCompleted",
        ExpressionAttributeValues: {
          ":isCompleted": !currentStatus,
        },
      };
      await docClient.send(new UpdateCommand(updateParams));
      
      // Update local state
      setDonations(donations.map(donation =>
        donation.donationId === donationId ? updatedDonation : donation
      ));
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Loading donations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-danger text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Donation Submissions</h1>
      
      <div className="row">
        {donations.map((donation) => (
          <div className="col-md-4 mb-4" key={donation.donationId}>
            <div className="card">
              <img
                src={donation.imageUrl || '/placeholder-image.jpg'}
                alt={`${donation.type} donation`}
                className="card-img-top"
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                  e.target.onerror = null;
                }}
              />
              <div className="card-body">
                <h5 className="card-title">{donation.type}</h5>
                <p className="card-text">
                  <strong>Quantity:</strong> {donation.quantity} kg<br />
                  {donation.description && (
                    <span><strong>Description:</strong> {donation.description}<br /></span>
                  )}
                  {donation.address && (
                    <span><strong>Address:</strong> {donation.address}<br /></span>
                  )}
                  <strong>Submitted:</strong> {new Date(donation.createdAt).toLocaleDateString()}
                </p>
                <button
                  className={`btn ${donation.isCompleted ? 'btn-danger' : 'btn-success'}`}
                  onClick={() => toggleCompletion(donation.donationId, donation.isCompleted)}
                >
                  {donation.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {donations.length === 0 && (
        <div className="text-center text-muted">
          No donations found.
        </div>
      )}
    </div>
  );
}
