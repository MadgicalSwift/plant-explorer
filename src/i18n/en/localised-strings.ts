import { categoryButton } from "../buttons/button";

export const localisedStrings = {
  welcomeMessage:
    'Welcome to Plant Explorer! 🌱 Discover amazing plants and learn why they’re so important for us and the Earth!',
    categorymessage: 'Choose a category to explore:',
  category: [
    'Flowering Plants 🌸',
    'Medicinal Plants 🌿',
    'Trees 🌳',
    'Fruits 🍎',
    'Vegetables 🥕',
    'Herbs 🌾',
    'Cacti 🌵',
    'Water Plants 💧',
    'Climbers and Creepers 🌿',
    'Carnivorous Plants 🪰',
  ],
  carousalMessage: (selectedCategory: string) => `Great choice! Here are some popular plants in the ${selectedCategory}. Click on any plant to learn more about it:`,
  afterCarousalMessage: (selectedCategory: string) => `Want to test your knowledge about ${selectedCategory}?`,
  startButton: 'Start Quiz',
  exploreMoreButton: 'Explore More Plants',
  quizMessage: (selectedCategory: string) => `Let’s start the quiz! Answer these 10 questions and see how much you know about ${selectedCategory}!`,
  correctAnser:'That’s correct! 🌟',
  incorrectAnswer: 'Oops, the correct answer was [Correct Answer].',
  seeMoreMessage: 'See More Data',
  language_hindi: 'हिन्दी',
  language_english: 'English',
  language_changed: 'Language changed to English',
};
