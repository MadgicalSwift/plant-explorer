import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { LocalizationService } from 'src/localization/localization.service';
import { MessageService } from 'src/message/message.service';
import {
  categoryButton,
  startAndExploreButton,
  firstQuestionWithOptionButtons,
  nextQuestionWithOptionButtons,
  scoreWithButtons,
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
  server_url = process.env.SERVER_LINK;

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

  /*async sendCarousal(from: string, selectedCategory: string) {
    if (!data[selectedCategory]?.plants) {
      console.log(
        `Category ${selectedCategory} not found or contains no plants.`,
      );
      return;
    }

    const plantCards = data[selectedCategory].plants.map((plant) => {
      const plantUrl = `${this.server_url}#/plant/${encodeURIComponent(
        plant.plant_name,
      )}`;

      return {
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
              url: plantUrl,
            },
          },
        ],
      };
    });

    const requestData = {
      to: from,
      type: 'card',
      card: plantCards,
    };

    try {
      const response = await this.sendMessage(
        this.baseUrl,
        requestData,
        this.apiKey,
      );
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }*/


    async sendCarousal(from: string, selectedCategory: string, offset: number = 0) {
      if (!data[selectedCategory]?.plants) {
          console.log(`Category ${selectedCategory} not found or contains no plants.`);
          return;
      }
  
      const plantsList = data[selectedCategory].plants;
      const totalPlants = plantsList.length;
      const pageSize = 5; 
      const nextOffset = offset + pageSize;
      const prevOffset = offset - pageSize;
  
      
      const plantCards = plantsList.slice(offset, nextOffset).map((plant) => {
          const plantUrl = `${this.server_url}#/plant/${encodeURIComponent(plant.plant_name)}`;
  
          return {
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
                          url: plantUrl,
                      },
                  },
              ],
          };
      });
  
      // Add pagination buttons
      const paginationButtons = [];
  
      // "Previous" button (if applicable)
      if (offset > 0) {
          paginationButtons.push({
              button_text: 'Previous',
              type: 'postback',
              payload: JSON.stringify({
                  action: 'paginate_plants',
                  category: selectedCategory,
                  offset: prevOffset, // Load previous batch
              }),
          });
      }
  
      // "Next" button (if applicable)
      if (nextOffset < totalPlants) {
          paginationButtons.push({
              button_text: 'Next',
              type: 'postback',
              payload: JSON.stringify({
                  action: 'paginate_plants',
                  category: selectedCategory,
                  offset: nextOffset, // Load next batch
              }),
          });
      }
  
      // Add pagination buttons as a separate card
      if (paginationButtons.length > 0) {
          plantCards.push({
              header: {
                  type: 'image',
                  image: {
                      url: 'https://example.com/pagination.png', // Placeholder image for pagination
                      body: 'More Plants',
                  },
              },
              body: {
                  title: 'More Plants',
                  subtitle: 'Navigate through the options using the buttons below.',
              },
              actions: paginationButtons,
          });
      }
  
      const requestData = {
          to: from,
          type: 'card',
          card: plantCards,
      };
  
      try {
          const response = await this.sendMessage(this.baseUrl, requestData, this.apiKey);
          return response;
      } catch (error) {
          console.error('Error sending message:', error);
      }
  }
  
  
  
  

  async sendStartQuizandExploreButton(from: string, selectedCategory: string) {
    const requestData = startAndExploreButton(from, selectedCategory);
    await this.sendMessage(this.baseUrl, requestData, this.apiKey);
  }

  async sendQuizMessage(from: string, selectedCategory: string) {
    const requestData = this.prepareRequestData(
      from,
      localisedStrings.quizMessage(selectedCategory),
    );
    await this.sendMessage(this.baseUrl, requestData, this.apiKey);
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
    const quizSets = data[selectedCategory]?.quiz_sets;
    if (!quizSets) {
      console.log(
        `Category ${selectedCategory} not found or does not have quiz sets.`,
      );
      return;
    }

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
    // Retrieve the explanation
    const explanation = currentQuestion.explanation;
    // Check if explanation is missing
    if (!explanation) {
      console.log('Explanation not found');
    }
    // Check if the user's answer matches the correct answer
    if (userAnswer === currentQuestion.answer) {
      const requestData = this.prepareRequestData(
        from,
        `${localisedStrings.correctAnser} \n**Explanation:** ${explanation}`,
      );

      await this.sendMessage(this.baseUrl, requestData, this.apiKey);
      return 1;
    } else {
      const requestData = this.prepareRequestData(
        from,
        `${localisedStrings.incorrectAnswer(
          currentQuestion.answer,
        )} \n**Explanation:** ${explanation}`,
      );

      await this.sendMessage(this.baseUrl, requestData, this.apiKey);
      return 0;
    }
  }

  async sendNextQuestion(
    from: string,
    selectedCategory: string,
    setName: string,
    currentQuestionIndex: number,
  ) {
    const requestData = nextQuestionWithOptionButtons(
      from,
      selectedCategory,
      setName,
      currentQuestionIndex,
    );

    await this.sendMessage(this.baseUrl, requestData, this.apiKey);
  }

  async sendScoreCard(from: string, score: number) {
    const percentage = (score / 5) * 100;
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(
      2,
      '0',
    )}-${String(currentDate.getMonth() + 1).padStart(
      2,
      '0',
    )}-${currentDate.getFullYear()}`;
    let badge = '';
    let performance = '';
    let animation = '';
    let text2 = '';
    // Assign badge and performance based on score
    if (score === 5) {
      badge = 'Gold🥇';
      performance = 'high';
      animation = 'confetti';
      text2 = 'Outstanding! Perfect score!';
    } else if (score >= 4) {
      badge = 'Silver🥈';
      performance = 'high';
      animation = 'confetti';
      text2 = 'Great job! You nailed it!';
    } else if (score >= 3) {
      badge = 'Bronze🥉';
      performance = 'medium';
      animation = undefined;
      text2 = 'Good effort! Keep it up!';
    } else {
      badge = 'Participant🎖️';
      performance = 'low';
      animation = undefined;
      text2 = 'Keep trying! You’ll improve!';
    }
    const requestData = {
      to: from,
      type: 'scorecard',
      scorecard: {
        theme: 'theme1',
        background: 'green',
        performance: performance,
        share_message: localisedStrings.shareMessage(score),
        text1: `${formattedDate}`,
        text2: text2,
        text3: `${percentage}%`,
        text4: `${badge}`,
        score: `${score}/10`,
        animation: animation,
      },
    };

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );

    return response;
  }

  async sendButtonAfterScore(from: string, selectedCategory: string) {
    const buttonData = scoreWithButtons(from, selectedCategory);
    const response = await this.sendMessage(
      this.baseUrl,
      buttonData,
      this.apiKey,
    );
    return response;
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
