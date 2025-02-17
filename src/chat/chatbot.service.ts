import { Injectable } from '@nestjs/common';
import IntentClassifier from '../intent/intent.classifier';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/model/user.service';
import { localisedStrings } from 'src/i18n/en/localised-strings';
import { MixpanelService } from 'src/mixpanel/mixpanel.service';

@Injectable()
export class ChatbotService {
  private readonly intentClassifier: IntentClassifier;
  private readonly message: MessageService;
  private readonly userService: UserService;
  private readonly mixpanel: MixpanelService;

  constructor(
    intentClassifier: IntentClassifier,
    message: MessageService,
    userService: UserService,
    mixpanel: MixpanelService,
  ) {
    this.intentClassifier = intentClassifier;
    this.message = message;
    this.userService = userService;
    this.mixpanel = mixpanel;
  }

  public async processMessage(body: any): Promise<any> {
    const { from, text, button_response, persistent_menu_response } = body;
    const textBody = text?.body;
    const buttonBody = button_response?.body;
    const persistentMenuBody = persistent_menu_response?.body;
    let maxPageNum =0
    let botID = process.env.BOT_ID;
    let userData = await this.userService.findUserByMobileNumber(from, botID);
    if (!userData) {
      console.log('Creating new user');
      userData = await this.userService.createUser(from, 'english', botID);
    }
  
    if (persistentMenuBody) {
      userData.currentQuestionIndex = 0;
      userData.score = 0;
      userData.hasSeenMore=false
      await this.message.sendcategory(from);
    }
    if (buttonBody) {
      // Mixpanel tracking data
      const trackingData = {
        distinct_id: from,
        button: buttonBody,
        botID: botID,
      };

      this.mixpanel.track('Button_Click', trackingData);
      switch (true) {
        case localisedStrings.category.includes(buttonBody):
          userData.selectedCategory = buttonBody;
          await this.message.sendCategoryMessage(from, buttonBody);
          maxPageNum = await this.message.sendCarousal(from, buttonBody,0);
          userData.currCrouslePage =0
          userData.maxCrouselPage = maxPageNum
          if(maxPageNum==userData.currCrouslePage){
            await this.message.sendStartQuizandExploreButton(
              from,
              userData.selectedCategory,
              false
            );
          }
          else{
            await this.message.sendStartQuizandExploreButton(
              from,
              userData.selectedCategory,
              true
            );
          }
          await this.userService.saveUser(userData);
          break;

        

        case buttonBody === localisedStrings.startButton: {
          // ✅ Check if 'seeMore' was clicked before starting the quiz
          if (userData.hasSeenMore) {
            console.log("User clicked 'See More' before starting the quiz");
            console.log(userData.hasSeenMore);
        
            await this.message.sendQuizMessage(from, userData.selectedCategory);
            const setName = await this.message.sendFirstquestion(from, userData.selectedCategory, true);
            userData.setName = setName;
        
          } else {
            await this.message.sendQuizMessage(from, userData.selectedCategory);
            const setName = await this.message.sendFirstquestion(from, userData.selectedCategory, false);
            console.log(userData.hasSeenMore, "vjgjgjhgj");
        
            userData.setName = setName;
          }
        
          try {
            await this.userService.saveUser(userData);
          } catch (error) {
            console.error("Error saving user data:", error);
          }
        
          break;
        }
        
        

        case buttonBody === localisedStrings.exploreButton:
          userData.currentQuestionIndex = 0;
          userData.score = 0;
          userData.hasSeenMore=false;
          await this.message.sendcategory(from);
          break;
        case buttonBody ===
          localisedStrings.moreAboutButton(userData.selectedCategory):
          console.log(buttonBody);
          maxPageNum = await this.message.sendCarousal(from, userData.selectedCategory, 0);
          if(maxPageNum==userData.currCrouslePage){
            await this.message.sendStartQuizandExploreButton(
              from,
              userData.selectedCategory,
              false
            );
          }
          else{
            await this.message.sendStartQuizandExploreButton(
              from,
              userData.selectedCategory,
              true
            );
          }
          break;
        
          
            case buttonBody === localisedStrings.seeMore(userData.selectedCategory):
              userData.currCrouslePage = userData.currCrouslePage + 1;
              maxPageNum = await this.message.sendCarousal(from, userData.selectedCategory, userData.currCrouslePage);
              //console.log(userData.hasSeenMore)
              //console.log(userData)
              // ✅ Mark that the user has seen more
              userData.hasSeenMore = true;
              console.log(userData.hasSeenMore)
              if (maxPageNum == userData.currCrouslePage) {
                await this.message.sendStartQuizandExploreButton(from, userData.selectedCategory, false);
              } else {
                await this.message.sendStartQuizandExploreButton(from, userData.selectedCategory, true);
              }
              
              await this.userService.saveUser(userData);
            break;


        case buttonBody === localisedStrings.plantCategoryButton:
          userData.hasSeenMore=false
          await this.message.sendcategory(from);
          break;
        case buttonBody === localisedStrings.retakeQuizButton:
         
          await this.message.sendNextQuestion(
            from,
            userData.selectedCategory,
            userData.setName,
            userData.currentQuestionIndex,
          );
          break;

        
          case buttonBody === localisedStrings.tryAnotherQuiz:
         
          if (userData.hasSeenMore) {
            
            await this.message.sendQuizMessage(from, userData.selectedCategory);
          const setName = await this.message.sendFirstquestion(from, userData.selectedCategory,true);
          userData.setName = setName;
          
          }else{
            await this.message.sendQuizMessage(from, userData.selectedCategory);
          const setName = await this.message.sendFirstquestion(from, userData.selectedCategory,false);
         
          userData.setName = setName;
         

          }


          break;
         
        default: {
          const score = await this.message.checkAnswer(
            from,
            userData.selectedCategory,
            userData.setName,
            userData.currentQuestionIndex,
            buttonBody,
          );
          userData.score += score;
          userData.currentQuestionIndex += 1;
          if (userData.currentQuestionIndex >= 5) {
            await this.message.sendScoreCard(from, userData.score);
            await this.message.sendButtonAfterScore(
              from,
              userData.selectedCategory,
            );
            userData.currentQuestionIndex = 0;
            userData.score = 0;
            break;
          }

          await this.message.sendNextQuestion(
            from,
            userData.selectedCategory,
            userData.setName,
            userData.currentQuestionIndex,
          );
          break;
        }
      }
    }
    if (localisedStrings.validText.includes(textBody)) {
      userData.currentQuestionIndex = 0;
      userData.score = 0;
      await this.message.sendWelcomeMessage(from, userData.language);
      await this.message.sendcategory(from);
    }
    await this.userService.saveUser(userData);
  }
}
export default ChatbotService;
