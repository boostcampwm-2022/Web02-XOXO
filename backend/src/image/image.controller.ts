/* eslint-disable @typescript-eslint/no-shadow */
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import ResponseEntity from '@root/common/response/response.entity';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly ImageService: ImageService) {}

  /**
   * '/image' 로 요청이 오면, 받은 이미지 파일을 오브젝트 스토리지에 업로드한다.
   * @param files 클라이언트 측에서 받은 이미지 파일 리스트 (최대 10장 설정)
   * @returns 오브젝트 스토리지에 업로드 된 이미지 주소 리스트
   */
  @Post()
  @UseInterceptors(FilesInterceptor('image', 10))
  async uploadImage(@UploadedFiles() files: Array<Express.Multer.File>) {
    const imagePathList = await this.ImageService.uploadImage(files);
    return ResponseEntity.CREATED_WITH_DATA(imagePathList);
  }
}
