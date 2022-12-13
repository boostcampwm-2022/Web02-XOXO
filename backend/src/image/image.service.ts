import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// 레퍼런스 : https://guide.ncloud-docs.com/docs/storage-storage-8-4

const upload = async (file: Express.Multer.File) => {
  const region = process.env.NCLOUD_REGION;
  const endpoint = process.env.NCLOUD_END_POINT;
  const bucketName = process.env.NCLOUD_BUCKET_NAME;
  const accessKey = process.env.NCLOUD_ACCESS_KEY;
  const secretKey = process.env.NCLOUD_SECRET_KEY;
  const fileName = `${uuidv4()}.${file.mimetype.match(/(?<=\/).*$/)}`;

  // S3 오브젝트 생성
  const S3 = new AWS.S3({
    endpoint,
    region,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
  });

  // 오브젝트 삽입
  await S3.putObject({
    Bucket: bucketName,
    Key: fileName,
    ACL: 'public-read',
    Body: file.buffer,
    ContentType: file.mimetype,
  }).promise();

  // 오브젝트 스토리지 내 이미지 파일 주소
  const imagePath = `${fileName}`;

  return imagePath;
};

@Injectable()
export class ImageService {
  async uploadImage(files: Array<Express.Multer.File>) {
    const imagePathList = await Promise.all(
      files.map((file: Express.Multer.File) => {
        return upload(file);
      }),
    );
    return imagePathList;
  }
}
