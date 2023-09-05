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
  getAssignment(): object {
    return {};
  }
  @Get('/writing')
  @Render('report')
  getWriting(): object {
    return {};
  }

  @Get('/question')
  @Render('question')
  getQuestion(): object {
    return {};
  }
  @Post('/chat')
  async chat(@Body() request) {
    const service = new AppService();
    return await service.chatCreation3(request);
  }

  @Post('/report')
  async report(@Body() reportInfo) {
    const service = new AppService();
    return await service.generateReport(reportInfo);
  }

  @Post('/file')
  @UseInterceptors(FileInterceptor('file'))
  async file(@UploadedFile() file: Express.Multer.File) {
    const service = new AppService();
    return { file: await service.extractTextFromFile(file) };
  }

  @Post('/file_chat')
  @UseInterceptors(FileInterceptor('file'))
  async file_chat(@UploadedFile() file: Express.Multer.File) {
    const service = new AppService();
    await service.fileChat(file);
    return {};
  }
  @Post('/report_file')
  @UseInterceptors(FileInterceptor('file'))
  async reportFile(
    @Body() reportInfo,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const service = new AppService();
    return await service.generateReportFile(
      JSON.parse(reportInfo.reportInfo),
      file,
    );
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
