import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BaseMessage, ChatMessage } from 'langchain/schema';
import { HumanMessagePromptTemplate } from 'langchain/prompts';

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

  async chatCreation(prompt) {
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
}
