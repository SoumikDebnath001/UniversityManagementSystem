

const AWS = require('aws-sdk');
const uuidv1 = require('uuid').v1;
var path = require('path');

const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const s3ClientNew = new S3Client({
	endpoint: "https://blr1.digitaloceanspaces.com", // Find your endpoint in the control panel, under Settings. Prepend "https://".
	forcePathStyle: false, // Configures to use subdomain/virtual calling format.
	region: "blr1", // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
	credentials: {
		accessKeyId: "DO00Y73PZ39KKWZW72NZ", // Access key pair. You can create access key pairs using the control panel or API.
		secretAccessKey: "Ss33rtq3YBF03CxZGudmWrJlW/B/f+iHr+Yyi4amLB8" // Secret access key defined through an environment variable.
	}
});


const paramsNew = {
	Bucket: "mlm-binary", // The path to the directory you want to upload the object to, starting with your Space name.
	Key: "", // Object key, referenced whenever you want to access this file later.
	Body: null, // The object's contents. This variable is an object, not a string.
	ACL: "public-read", // Defines ACL permissions, such as private or public.
	Metadata: { // Defines metadata tags.
		"HTTP": "text/html"
	}
};



async function doUpload(req, filder = null) {
	// console.log('mimetype', req.body);
	let uni = uuidv1();
	const params = paramsNew;
	if (filder !== null) {
		params.Key = filder + "/" + uni + path.extname(req.file.originalname);
	} else {
		params.Key = uni + path.extname(req.file.originalname);
	}
	let originalName = req.file.originalname;
	console.log(originalName)
	params.Body = req.file.buffer;
	try {
		// let s3Get = await new AWS.S3(cartifig).putObject(params).promise();
		const s3Get = await s3ClientNew.send(new PutObjectCommand(params));

		let data = {
			status: true,
			"originalname": originalName,
			url: "https://mlm-binary.blr1.digitaloceanspaces.com/" + params.Key,

		};
		console.log("Successfully uploaded data to bucket", s3Get);
		return data;
	} catch (e) {
		console.log("Error uploading data: ", e);
		return {
			status: false,
			e
		};
	}
}

module.exports = {
	doUpload
};