
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

import { CourseService } from './course.service.js';
import { CreateCourseDto } from './Dto/create-course.dto.js';
import { UpdateCourseDto } from './Dto/update-course.dto.js';

const uploadPath = join(process.cwd(), 'uploads');

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Get(':id')
  getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }

  @Post()
  createCourse(@Body() dto: CreateCourseDto) {
    return this.courseService.createCourse(dto);
  }

  @Put(':id')
  updateCourse(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(id, dto);
  }

  @Patch(':id')
  patchCourse(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.courseService.patchCourse(id, dto);
  }

  @Delete(':id')
  deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }

          callback(null, uploadPath);
        },

        filename: (req, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
            extname(file.originalname).toLowerCase();

          callback(null, uniqueName);
        },
      }),

      fileFilter: (req, file, callback) => {
        const allowedExtensions = /\.(jpg|jpeg|png|pdf)$/i;
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'application/pdf',
        ];

        const validExtension =
          allowedExtensions.test(file.originalname);

        const validMimeType =
          allowedMimeTypes.includes(file.mimetype);

        if (validExtension && validMimeType) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Only JPG, JPEG, PNG, and PDF files are allowed',
            ),
            false,
          );
        }
      },

      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  uploadCourseMaterial(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.courseService.uploadCourseMaterial(id, file);
  }
}
