import AWS from 'aws-sdk';

export const s3 = new AWS.S3();

export const getSignedUrl = async (key, fileType) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Expires: 60 * 5,
    ContentType: fileType,
  };
  return s3.getSignedUrlPromise('putObject', params);
};

export const getObjectStream = (key) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  };
  return s3.getObject(params).createReadStream();
};

export const deleteObject = (key) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  };
  return s3.deleteObject(params).promise();
};

export const getSignedUrlForRead = async (key) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  };
  const headData = await s3.headObject(params).promise();
  const url = s3.getSignedUrl('getObject', params);
  return { url, headData };
};
