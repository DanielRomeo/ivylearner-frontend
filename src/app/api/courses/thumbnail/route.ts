// app/api/courses/thumbnail/route.ts
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
	region: process.env.NEXT_PUBLIC_AWS_REGION!,
	credentials: {
		accessKeyId: process.env.NETLIFY_AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.NETLIFY_AWS_SECRET_ACCESS_KEY!,
	},
});

export async function POST(request: Request) {
	try {
		const { fileName, fileType } = await request.json();

		// Validate file type
		if (!fileType.startsWith('image/')) {
			return NextResponse.json(
				{ error: 'Invalid file type. Only images are allowed.' },
				{ status: 400 }
			);
		}

		const fileKey = `courseThumbnails/${Date.now()}-${fileName}`;

		const command = new PutObjectCommand({
			Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
			Key: fileKey,
			ContentType: fileType,
            ChecksumAlgorithm: undefined

		});

		const uploadUrl = await getSignedUrl(s3Client, command, {
			expiresIn: 3600,
		});

		const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileKey}`;

		return NextResponse.json({
			uploadUrl,
			fileUrl,
			contentType: fileType,
		});
	} catch (error) {
		console.error('Error generating pre-signed URL:', error);
		return NextResponse.json(
			{ error: 'Failed to generate upload URL', details: error },
			{ status: 500 }
		);
	}
}
