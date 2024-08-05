import db from '@/database';
import { faker } from '@faker-js/faker';

/**
 * GET /
 * Home page
 */
export const index = (req, res) => res.send('Hello World!');

/**
 * GET /health
 * Health check
 */
export const healthCheck = (req, res) => res.json({ success: true });

const categories = [
  'Movies',
  'Home, People',
  'Travel, Adventure',
  'Fitness, Health',
  'Music',
  'Food, Drink',
  'Fashion',
  'Sports',
  'Tech, Science',
  'Animals',
  'Vehicles',
  'Comedy',
  'Nonprofits, Activism',
  'Science, Technology',
  'Travel, Events',
  'Other',
];
const videoKeys = [
  '197485-905015019_small.mp4',
  'istockphoto-485784548-640_adpp_is.mp4',
  'istockphoto-1455749437-640_adpp_is.mp4',
];
const imageKeys = [
  '5.jpeg',
  '4.jpeg',
  '3.jpg',
  '2.jpeg',
  '1.jpe',
];
export const populateDB = async (req, res) => {
  try {
    // Generate 10 random users
    const users = [];
    for (let i = 0; i < 10; i += 1) {
      users.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Bulk create users
    const createdUsers = await db.models.user.bulkCreate(users);

    // Generate 100 random videos associated with the created users
    const videos = [];
    for (let i = 0; i < 100; i += 1) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      videos.push({
        userId: randomUser.id,
        title: faker.lorem.sentence(),
        categories: [categories[Math.floor(Math.random() * categories.length)]],
        fileKey: videoKeys[Math.floor(Math.random() * videoKeys.length)], // '1717370829375-vid.mp4',
        thumbnailKey: imageKeys[Math.floor(Math.random() * videoKeys.length)], // '1717370829376-logo.png',
        description: faker.lorem.paragraphs(),
        duration: faker.number.int({ min: 1, max: 3600 }),
        width: faker.number.int({ min: 480, max: 1920 }),
        height: faker.number.int({ min: 360, max: 1080 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Bulk create videos
    await db.models.video.bulkCreate(videos);

    res.status(200).send('Random users and videos created successfully!');
  } catch (error) {
    console.log('🚀 ~ populateDB ~ error:', error);
    res.status(500).send('An error occurred while creating random data.');
  }
};
