import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { LocalizationService } from 'src/localization/localization.service';
import { MessageService } from 'src/message/message.service';
import {
  categoryButton,
  tartQuizOrExploreMoreButton,
  firstQuestionWithOptionButtons,
} from 'src/i18n/buttons/button';
import { localisedStrings } from 'src/i18n/en/localised-strings';
import data from 'src/datasource/data.json';

dotenv.config();

@Injectable()
export class SwiftchatMessageService extends MessageService {
  botId = process.env.BOT_ID;
  apiKey = process.env.API_KEY;
  apiUrl = process.env.API_URL;
  baseUrl = `${this.apiUrl}/${this.botId}/messages`;

  private prepareRequestData(from: string, requestBody: string): any {
    return {
      to: from,
      type: 'text',
      text: {
        body: requestBody,
      },
    };
  }

  async sendWelcomeMessage(from: string, language: string) {
    const requestData = this.prepareRequestData(
      from,
      localisedStrings.welcomeMessage,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }

  async sendcategory(from: string) {
    const requestData = categoryButton(from);
    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }

  async sendCategoryMessage(from: string, selectedCategory: string) {
    const requestData = this.prepareRequestData(
      from,
      localisedStrings.carousalMessage(selectedCategory),
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }

  async sendCarousal(from: string, selectedCategory: string) {
    if (!data[selectedCategory] || !data[selectedCategory].plants) {
      console.log(
        `Category ${selectedCategory} not found or contains no plants.`,
      );
      return;
    }
    const plantCards = data[selectedCategory].plants.map((plant) => ({
      header: {
        type: 'image',
        image: {
          url: plant.image_url,
          body: plant.plant_name,
        },
      },
      body: {
        title: plant.plant_name,
        subtitle: `Explore the beauty of the ${plant.plant_name}`,
      },
      actions: [
        {
          button_text: 'Learn More',
          type: 'website',
          website: {
            title: `Learn about ${plant.plant_name}`,
            payload: 'plant_info',
            url: `http://localhost:3001/plant/${plant.plant_name}`,
          },
        },
      ],
    }));

    const requestData = {
      to: from,
      type: 'card',
      card: plantCards,
    };

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }

  async sendStartQuizOrExploreMoreButton(from: string, selectedCategory: string) {
    const requestData = tartQuizOrExploreMoreButton(from, selectedCategory);
    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
  }

  async sendQuizMessage(from: string, selectedCategory: string) {
    const requestData = this.prepareRequestData(
      from,
      localisedStrings.quizMessage(selectedCategory),
    );
    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
  }

  async sendFirstquestion(from: string, selectedCategory: string) {
    const { requestData, setName } = firstQuestionWithOptionButtons(
      from,
      selectedCategory,
    );
    await this.sendMessage(this.baseUrl, requestData, this.apiKey);
    return setName;
  }

  async checkAnswer(
    from: string,
    selectedCategory: string,
    setName: string,
    currentQuestionIndex: number,
    userAnswer: string,
  ) {
    // Check if the selected category and quiz sets exist
    if (!data[selectedCategory] || !data[selectedCategory].quiz_sets) {
      console.log(
        `Category ${selectedCategory} not found or does not have quiz sets.`,
      );
      return;
    }

    // Get the quiz sets from the selected category
    const quizSets = data[selectedCategory].quiz_sets;

    // Find the quiz set that matches the setName
    const selectedQuizSet = quizSets.find((set) => set.set_name === setName);
    if (!selectedQuizSet) {
      console.log(`Quiz Set ${setName} not found.`);
      return;
    }

    // Ensure the currentQuestionIndex is within the bounds of the questions array
    if (
      currentQuestionIndex < 0 ||
      currentQuestionIndex >= selectedQuizSet.questions.length
    ) {
      console.log('Invalid question index.');
      return;
    }

    // Get the current question
    const currentQuestion = selectedQuizSet.questions[currentQuestionIndex];

    // Check if the user's answer matches the correct answer
    if (userAnswer === currentQuestion.answer) {
      const requestData = this.prepareRequestData(
        from,
        localisedStrings.correctAnser,
      );

      await this.sendMessage(this.baseUrl, requestData, this.apiKey);
      return 1;
    } else {
      const requestData = this.prepareRequestData(
        from,
        localisedStrings.incorrectAnswer,
      );

      await this.sendMessage(this.baseUrl, requestData, this.apiKey);
      return 0;
    }
  }

  async sendLanguageChangedMessage(from: string, language: string) {
    const localisedStrings = LocalizationService.getLocalisedString(language);
    const requestData = this.prepareRequestData(
      from,
      localisedStrings.select_language,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }
}
