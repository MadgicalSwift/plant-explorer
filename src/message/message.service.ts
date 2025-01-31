import { Injectable } from '@nestjs/common';
import axios from 'axios';
// import { CustomException } from 'src/common/exception/custom.exception';
import { localisedStrings } from 'src/i18n/en/localised-strings';

@Injectable()
export abstract class MessageService {
  async prepareWelcomeMessage() {
    return localisedStrings.welcomeMessage;
  }
  getSeeMoreButtonLabel() {
    return localisedStrings.seeMoreMessage;
  }

  async sendMessage(baseUrl: string, requestData: any, token: string) {
    try {
      const response = await axios.post(baseUrl, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.log('Error sending message:', error.response?.data);
    }
  }

  abstract sendWelcomeMessage(from: string, language: string);
  abstract sendLanguageChangedMessage(from: string, language: string);
  abstract sendcategory(from: string)
  abstract sendCarousal(from: string, selectedCategory: string,currentPage: number);
  abstract sendStartQuizandExploreButton(from: string, selectedCategory: string, isSeeMore: boolean);
  abstract sendQuizMessage(from: string, selectedCategory: string);
  abstract sendFirstquestion(from: string, selectedCategory: string);
  abstract sendNextQuestion(from: string, selectedCategory: string, setName: string, currentQuestionIndex: number);
  abstract checkAnswer(from: string, selectedCategory: string, setName: string, currentQuestionIndex: number, userAnswer: string);
  abstract sendScoreCard(from: string, score: number);
  abstract sendButtonAfterScore(from: string, selectedCategory: string);
  abstract sendCategoryMessage(from: string, selectedCategory: string);
}
