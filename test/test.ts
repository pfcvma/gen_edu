import { AppService } from '../src/app.service';
import path = require('path');
const test = new AppService();
const info = {
  purpose: '레포트',
  subject: '오펜하이머',
  title: '로버트는 얼마나 좋았을까',
  subtitle:
    '1. 오펜하이머의 일생\n2. 오펜하이머의 업적\n3. 오펜하이머를 바라보는 세상의 시선',
  length: '500',
  explanation: '반말로 써줘',
};
// test.chatCreation('오펜하이머가 누구야?').then((res) => console.log(res));
// test.generateReport(info).then((res) => console.log(res));
// test.makeReportPrompt(info).then((res) => console.log(res));
// console.log(test.makeReportPrompt(info));
// console.log('hello');
console.log(test.requestWithFile());
// console.log(path.parse("/aaa.png").ext);

