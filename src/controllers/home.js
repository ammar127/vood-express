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

export const populateDB = async (req, res) => {
  try {
    // Generate 10 random users
    const users = [];
    for (let i = 0; i < 10; i += 1) {
      users.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
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
        title: faker.lorem.words(),
        categories: faker.lorem.words().split(' '),
        fileKey: '1717370829375-vid.mp4',
        thumbnailKey: '1717370829376-logo.png',
        description: faker.lorem.sentences(),
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
    console.error('Error creating random data:', error);
    res.status(500).send('An error occurred while creating random data.');
  }
};
