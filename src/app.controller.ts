import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello(): object {
    return {};
    // return this.appService.getHello();
  }
  @Post('/report')
  async reportTest(@Body() reportInfo) {
    const service = new AppService();
    return await service.generateReport(reportInfo);
  }
  @Post('/assignment_text')
  async assignmentTest(@Body() body) {
    const service = new AppService();
    return await service.solveAssignment(body.text);
  }
  @Post('/assignment_image')
  @UseInterceptors(FileInterceptor('file'))
  async assignmentImage(@UploadedFile() file: Express.Multer.File) {
    const service = new AppService();
    return await service.solveAssignmentFromImage(file);
  }

  @Post('/ppt')
  @UseInterceptors(FileInterceptor('file'))
  async pptTest(@UploadedFile() file: Express.Multer.File) {
    const service = new AppService();
    return await service.extractTextFromOffice(file);
  }

  @Post('/pdf')
  @UseInterceptors(FileInterceptor('file'))
  async pdfTest(@UploadedFile() file: Express.Multer.File) {
    const service = new AppService();
    return await service.extractTextFromPDF(file);
  }
}
