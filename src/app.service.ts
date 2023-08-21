import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BaseMessage } from 'langchain/schema';
import { HumanMessagePromptTemplate } from 'langchain/prompts';
import path = require('path');
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface reportInfoObject {
  purpose: string;
  title: string;
  subject: string;
  [key: string]: string | null; // 나머지 속성의 타입을 string으로 지정
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async chatCreation(prompt: string) {
    //util
    const chat = new ChatOpenAI({
      openAIApiKey: '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',
      temperature: 0,
    });
    return await chat.predict(prompt);
  }
  async generateReport(reportInfo: reportInfoObject) {
    const prompt = await this.makeReportPrompt(reportInfo);
    return this.chatCreation(prompt);
  }
  async makeReportPrompt(reportInfo: reportInfoObject) {
    const promptTemplate: string =
      '{purpose} 를 작성하고 싶어. 글의 제목은 "{title}" 이고 주제는 "{subject}" 야.\n';
    const basicPrompt = HumanMessagePromptTemplate.fromTemplate(promptTemplate);
    let prompt: BaseMessage[] | string = await basicPrompt.formatMessages({
      purpose: reportInfo.purpose,
      title: reportInfo.title,
      subject: reportInfo.subject,
    });
    prompt = prompt[0]['content'];
    if ('subtitle' in reportInfo)
      prompt += '소제목은 \n' + reportInfo.subtitle + '\n이야.\n';
    if ('length' in reportInfo)
      prompt += '글자수는 ' + reportInfo.length + '자로 맞춰줘.\n';
    if ('explanation' in reportInfo)
      prompt +=
        '다음은 글을 작성하면서 지켜야할 조건이야.\n' + reportInfo.explanation;
    return prompt + '\n위를 토대로 작성해줘.';
  }
  async solveAssignmentFromImage(file: Express.Multer.File) {
    const text = await this.convertImageToText(file);
    return await this.solveAssignment(text);
  }
  async solveAssignment(text: string) {
    const promptTemplate: string =
      '{problem} \n 위 문제를 풀어서 해답과 풀이를 같이 알려줘.\n"답: [해답]\n풀이: [풀이]"\n이 형식으로 출력해줘.';
    const basicPrompt = HumanMessagePromptTemplate.fromTemplate(promptTemplate);
    const prompt: BaseMessage[] | string = await basicPrompt.formatMessages({
      problem: text,
    });
    return this.chatCreation(prompt[0]['content']);
  }
  async convertImageToText(file: Express.Multer.File): Promise<string> {
    const res = await this.sendOcrRequest(file);
    let text;
    if (res.status === 200) {
      console.log('requestWithBase64 response:', res.data);
      text = this.parseTextFromOcr(res.data.images[0].fields);
    } // 에러 처리 해야댐
    return text;
  }
  parseTextFromOcr(fields: Array<object>): string {
    //util
    let text: string = '';
    for (let i = 0; i < fields.length; i++) {
      text += fields[i]['inferText'] + ' ';
      if (fields[i]['lineBreak'] === true) text += '\n';
    }
    return text;
  }

  async sendOcrRequest(file: Express.Multer.File) {
    //util
    const imgInfo = path.parse(file.originalname);
    const imgBuffer = file.buffer;
    return await axios.post(
      'https://z2nh2vrzxc.apigw.ntruss.com/custom/v1/23377/4bf95343d7cdb272f089e07b714264b3c2da5ad5922d02c4d83f35918ae06688/general', // APIGW Invoke URL
      {
        images: [
          {
            format: imgInfo.ext.slice(1), // file format
            name: imgInfo.name, // image name
            data: imgBuffer.toString('base64'), // image base64 string(only need part of data). Example: base64String.split(',')[1]
          },
        ],
        requestId: uuidv4(), // unique string
        timestamp: 0,
        version: 'V2',
      },
      {
        headers: {
          'X-OCR-SECRET': 'YnhWaXF3SmNGbnVSbWdXbWd6blJCT1pPY0F6QmxQQ3A=', // Secret Key
        },
      },
    );
  }
}
