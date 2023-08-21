import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
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
}
