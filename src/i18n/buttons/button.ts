import { localisedStrings } from '../en/localised-strings';
import data from 'src/datasource/data.json';
import _ from 'lodash';

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
          body: localisedStrings.categorymessage, // Customize this text if needed
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

export function firstQuestionWithOptionButtons(
  from: string,
  selectedCategory: string,
) {
  // Check if the selected category exists and has a quiz_sets field
  if (!data[selectedCategory]) {
    console.log(`Category ${selectedCategory} not found.`);
    return;
  }
  if (
    !data[selectedCategory].quiz_sets ||
    data[selectedCategory].quiz_sets.length === 0
  ) {
    console.log(`No quiz sets found for category ${selectedCategory}.`);
    return;
  }
  // Get the quiz sets from the selected category
  const quizSets = data[selectedCategory].quiz_sets;

  // Randomly select a quiz set
  const randomSetIndex = Math.floor(Math.random() * quizSets.length);
  const selectedQuizSet = quizSets[randomSetIndex];

  // Select the first question (index 0) from the selected quiz set
  const firstQuestion = selectedQuizSet.questions[0];

  // Check if the first question has options
  if (!firstQuestion.options || firstQuestion.options.length === 0) {
    console.log(
      `No options available for the question: "${firstQuestion.question}".`,
    );
    return;
  }
  const shuffledOptions = _.shuffle(firstQuestion.options);
  // Send the first question to the user
  const requestData = {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: `Question 1.\n${firstQuestion.question}`, // Displaying the question text
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
  // Ensure the current question index is within the bounds of the questions array
  if (currentQuestionIndex >= selectedQuizSet.questions.length) {
    console.log('No more questions available in this quiz set.');
    return;
  }

  // Get the current question based on the provided index
  const currentQuestion = selectedQuizSet.questions[currentQuestionIndex];

  // Check if the current question has options
  if (!currentQuestion.options || currentQuestion.options.length === 0) {
    console.log(
      `No options available for the question: "${currentQuestion.question}".`,
    );
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
          body: `Question ${currentQuestionIndex}.\n${currentQuestion.question}`, // Displaying the current question text
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
          body: localisedStrings.moreAboutButton(selectedCategory),
          reply: localisedStrings.moreAboutButton(selectedCategory),
        },
        {
          type: 'solid',
          body: localisedStrings.plantCategoryButton,
          reply: localisedStrings.plantCategoryButton,
        },
        {
          type: 'solid',
          body: localisedStrings.retakeQuizButton,
          reply: localisedStrings.retakeQuizButton,
        },
        {
          type: 'solid',
          body: localisedStrings.tryAnotherQuiz,
          reply: localisedStrings.tryAnotherQuiz,
        }

      ],
      allow_custom_response: false,
    },
  };

}