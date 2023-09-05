import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BaseMessage } from 'langchain/schema';
import { HumanMessagePromptTemplate } from 'langchain/prompts';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Configuration, OpenAIApi } = require('openai');
import path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const officeParser = require('officeparser');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFParser = require('pdf-parse');

interface reportInfoObject {
  purpose: string;
  title: string;
  subject: string;
  [key: string]: string | null; // 나머지 속성의 타입을 string으로 지정
}

let messages = [];

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  createOpenAIApi(apiKey) {
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    return new OpenAIApi(configuration);
  }

  async chatCreation2(prompt: string) {
    // const openai = new OpenAI({
    //   apiKey: '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',
    // });
    const configuration = new Configuration({
      apiKey: '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',
    });
    const openai = new OpenAIApi(configuration);
    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });
    return chatCompletion.data.choices[0].message.content;
    // console.log(chatCompletion.data.choices[0].message.content);
  }

  async chatCreation3(message) {
    // const openai = new OpenAI({
    //   apiKey: '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',
    // });
    const configuration = new Configuration({
      apiKey: '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',
    });
    messages.push({ role: 'user', content: message.request });
    const openai = new OpenAIApi(configuration);
    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: messages,
    });
    return { response: chatCompletion.data.choices[0].message.content };
    // console.log(chatCompletion.data.choices[0].message.content);
  }

  async fileChat(file: Express.Multer.File) {
    const text = await this.extractTextFromFile(file);
    messages = [
      { role: 'user', content: text + '\n위 글에 대해 질문 할거야.' },
    ];
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
    const report = await this.chatCreation2(prompt);
    return { report };
  }

  async generateReportFile(
    reportInfo: reportInfoObject,
    file: Express.Multer.File,
  ) {
    const prompt = await this.makeReportPromptFile(reportInfo, file);
    const report = await this.chatCreation2(prompt);
    return { report };
  }
  async makeReportPrompt(reportInfo: reportInfoObject) {
    const promptTemplate: string =
      '{purpose} 를 작성하고 싶어. 글의 제목은 "{title}" 이야.\n';
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

  async makeReportPromptFile(
    reportInfo: reportInfoObject,
    file: Express.Multer.File,
  ) {
    const fileText = await this.extractTextFromFile(file);
    const promptTemplate: string =
      '{purpose} 를 작성하고 싶어. 글의 제목은 "{title}" 이야.\n';
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
    prompt += '\n그리고 아래 글을 참고해서 작성해줘.\n' + fileText;
    return prompt + '\n위를 토대로 작성해줘.';
  }

  makePurposePrompt(purpose) {
    let text = '';
    if (purpose === '증권사 리포트') {
      text = '';
      return text;
    } else if (purpose === '교양 레포트') {
      text = '';
      return text;
    } else if (purpose === '사실관계증명서') {
      text = '';
      return text;
    } else if (purpose === '생활기록부') {
      text = '';
      return text;
    } else if (purpose === '자기소개서') {
      text = '';
      return text;
    }
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
    const result = await this.chatCreation(prompt[0]['content']);
    return this.convertJson(result);
  }

  convertJson(inputString) {
    const responseArray = inputString
      .split('\n')
      .filter((line) => line.trim() !== '');

    // 기본값 설정
    let answer = '';
    let solution = '';

    // 배열을 순회하면서 "답: "과 "풀이: "을 찾아서 해당 문자열 추출
    for (const line of responseArray) {
      if (line.startsWith('답: ')) {
        answer = line.substring(3); // "답: " 이후의 문자열
      } else if (line.startsWith('풀이: ')) {
        solution = line.substring(4); // "풀이: " 이후의 문자열
      }
    }

    return { answer, solution };
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
  extractTextFromFiles(files: Array<Express.Multer.File>): string {
    let text: string = '';
    for (let i = 0; i < files.length; i++) {
      if (path.parse(files[i].originalname).ext.slice(1) === 'pdf') {
        text += '문서 이름: ' + files[i].originalname + '\n';
        text += this.extractTextFromPDF(files[i]);
      } else {
        text += '문서 이름: ' + files[i].originalname + '\n';
        text += this.extractTextFromOffice(files[i]);
      }
    }
    return text;
  }

  async extractTextFromFile(file: Express.Multer.File) {
    let text: string = '';

    if (path.parse(file.originalname).ext.slice(1) === 'pdf') {
      text += '문서 이름: ' + file.originalname + '\n';
      text += await this.extractTextFromPDF(file);
    } else {
      text += '문서 이름: ' + file.originalname + '\n';
      text += await this.extractTextFromOffice(file);
    }

    return text;
  }
  async extractTextFromOffice(file: Express.Multer.File) {
    return await officeParser.parseOfficeAsync(file.buffer);
  }

  async extractTextFromPDF(file: Express.Multer.File) {
    const data = await PDFParser(file.buffer);
    return data.text;
  }
}
