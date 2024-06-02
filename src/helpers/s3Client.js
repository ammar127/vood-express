import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const getSignedUrl = async (key, fileType) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Expires: 60 * 5,
    ContentType: fileType,
  };
  return s3.getSignedUrlPromise('putObject', params);
};

export default s3;
