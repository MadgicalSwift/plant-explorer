import { localisedStrings } from '../en/localised-strings';
import data from 'src/datasource/data.json';

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

export function tartQuizOrExploreMoreButton(from: string, selectedCategory: string) {
  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: localisedStrings.afterCarousalMessage(selectedCategory)
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
          body: localisedStrings.exploreMoreButton,
          reply: localisedStrings.exploreMoreButton,
        },
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
  // Send the first question to the user
  const requestData = {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: firstQuestion.question, // Displaying the question text
        },
      },
      buttons: firstQuestion.options.map((option) => ({
        type: 'solid',
        body: option,
        reply: option,
      })),
      allow_custom_response: false,
    },
  };
  return { requestData, setName: selectedQuizSet.set_name };
}
