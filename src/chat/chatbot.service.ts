import { Injectable } from '@nestjs/common';
import IntentClassifier from '../intent/intent.classifier';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/model/user.service';
import { localisedStrings } from 'src/i18n/en/localised-strings';
@Injectable()
export class ChatbotService {
  private readonly intentClassifier: IntentClassifier;
  private readonly message: MessageService;
  private readonly userService: UserService;

  constructor(
    intentClassifier: IntentClassifier,
    message: MessageService,
    userService: UserService,
  ) {
    this.intentClassifier = intentClassifier;
    this.message = message;
    this.userService = userService;
  }

  public async processMessage(body: any): Promise<any> {
    const { from, text, button_response } = body;
    const textBody = text?.body;
    const buttonBody = button_response?.body;
    let botID = process.env.BOT_ID;
    let userData = await this.userService.findUserByMobileNumber(from);
    if (!userData) {
      console.log('Creating new user');
      userData = await this.userService.createUser(from, 'english', botID);
    }

    if (buttonBody) {
      switch (true) {
        case localisedStrings.category.includes(buttonBody):
          userData.selectedCategory = buttonBody;
          await this.message.sendCategoryMessage(from, buttonBody);
          await this.message.sendCarousal(from, buttonBody);
          await this.message.sendStartQuizOrExploreMoreButton(
            from,
            userData.selectedCategory,
          );
          break;

        case buttonBody === localisedStrings.startButton: // Checks if the 'Start Exploring' button was pressed
          await this.message.sendQuizMessage(from, userData.selectedCategory);
          const setName = await this.message.sendFirstquestion(
            from,
            userData.selectedCategory,
          );
          userData.setName = setName;
          break;

        case buttonBody === localisedStrings.exploreMoreButton: // Checks if the 'Explore More' button was pressed
          break;
        default:
          const score = await this.message.checkAnswer(
            from,
            userData.selectedCategory,
            userData.setName,
            userData.currentQuestionIndex,
            buttonBody,
          );
          userData.score = score;
          break;
      }
    } else {
      console.log('text', textBody);
      await this.message.sendWelcomeMessage(from, userData.language);
      await this.message.sendcategory(from);
    }
    await this.userService.saveUser(userData);
  }
}
export default ChatbotService;
