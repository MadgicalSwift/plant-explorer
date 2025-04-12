import { localisedStrings } from '../en/localised-strings';
import data from 'src/datasource/data.json';
import _ from 'lodash';
import { Body } from '@nestjs/common';
import ChatbotService from 'src/chat/chatbot.service';
export function categoryButton(from: string) {
  const buttons = localisedStrings.category.map((category: string) => ({
    type: 'solid',
    body: category,
    reply: category,
  }));
  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: localisedStrings.categorymessage, 
        },
      },
      buttons: buttons,
      allow_custom_response: false,
    },
  };
}

export function startAndExploreButton(
  from: string,
  selectedCategory: string,
) {
  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: localisedStrings.afterCarousalMessage(selectedCategory),
        },
      },
      buttons: [
        {
          type: 'solid',
          body: localisedStrings.startButton,
          reply: localisedStrings.startButton,
        },
        {
          type: 'solid',
          body: localisedStrings.exploreButton,
          reply: localisedStrings.exploreButton,
        }
      ],
      allow_custom_response: false,
    },
  };
}

export function QuizWithMoreButton(
  from: string,
  selectedCategory: string,
) {
  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: localisedStrings.afterCarousalMessage(selectedCategory),

        },
      },
      buttons: [
        {
          type: 'solid',
          body: localisedStrings.seeMore(selectedCategory),
          reply: localisedStrings.seeMore(selectedCategory),
        },
        {
          type: 'solid',
          body: localisedStrings.startButton,
          reply: localisedStrings.startButton,
        },
        {
          type: 'solid',
          body: localisedStrings.exploreButton,
          reply: localisedStrings.exploreButton,
        }
      ],
      allow_custom_response: false,
    },
  };
}

export function firstQuestionWithOptionButtons(
  from: string,
  selectedCategory: string,
isClick:boolean) {

  if (!data[selectedCategory]) {
  
    return;
  }
  if (
    !data[selectedCategory].quiz_sets ||
    data[selectedCategory].quiz_sets.length === 0
  ) {
   
    return;
  }

  const quizSets = data[selectedCategory].quiz_sets;

  
  let randomSetIndex = 0

  let selectedQuizSet = quizSets[0];
if(isClick){
  randomSetIndex = Math.floor(Math.random() *quizSets.length);
  
  selectedQuizSet = quizSets[randomSetIndex];

}else{
  randomSetIndex = Math.floor(Math.random() *10);
 
  
 selectedQuizSet = quizSets[randomSetIndex];
}

  
  const firstQuestion = selectedQuizSet.questions[0];

 
  if (!firstQuestion.options || firstQuestion.options.length === 0) {
    
    return;
  }
  const shuffledOptions = _.shuffle(firstQuestion.options);
 
  const requestData = {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: `*Question 1.* \n${firstQuestion.question}`, 
        },
      },
      buttons: shuffledOptions.map((option) => ({
        type: 'solid',
        body: option,
        reply: option,
      })),
      allow_custom_response: false,
    },
  };
  return { requestData, setName: selectedQuizSet.set_name };
}

export function nextQuestionWithOptionButtons(
  from: string,
  selectedCategory: string,
  setName: string,
  currentQuestionIndex: number,
) {
  const quizSets = data[selectedCategory]?.quiz_sets;
  if (!quizSets) {
    
    return;
  }
 
  const selectedQuizSet = quizSets.find((set) => set.set_name === setName);
  if (!selectedQuizSet) {
   
    return;
  }
  
  if (currentQuestionIndex >= selectedQuizSet.questions.length) {
    
    return;
  }

  
  const currentQuestion = selectedQuizSet.questions[currentQuestionIndex];

 
  if (!currentQuestion.options || currentQuestion.options.length === 0) {
    
    
    return;
  }
  currentQuestionIndex += 1;
  
  const shuffledOptions = _.shuffle(currentQuestion.options);
  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: `*Question ${currentQuestionIndex}.* \n${currentQuestion.question}`, 
        },
      },
      buttons: shuffledOptions.map((option) => ({
        type: 'solid',
        body: option,
        reply: option,
      })),
      allow_custom_response: false,
    },
  };
}

export function scoreWithButtons(from: string, selectedCategory: string){
  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: localisedStrings.afterQuizCompletionMessage,
        },
      },
      buttons: [
        {
          type: 'solid',
          body: localisedStrings.retakeQuizButton,
          reply: localisedStrings.retakeQuizButton,
        },
        {
          type: 'solid',
          body: localisedStrings.tryAnotherQuiz,
          reply: localisedStrings.tryAnotherQuiz,
        },
        {
          type: 'solid',
          body: localisedStrings.moreAboutButton(selectedCategory),
          reply: localisedStrings.moreAboutButton(selectedCategory),
        },
        {
          type: 'solid',
          body: localisedStrings.plantCategoryButton,
          reply: localisedStrings.plantCategoryButton,
        }

      ],
      allow_custom_response: false,
    },
  };

}