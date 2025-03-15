const { faker } = require("@faker-js/faker");
const { sequelize } = require("../src/config/database");
const {
  User,
  Tournament,
  Game,
  Ranking,
  Notification,
} = require("../src/models");

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected!");

    
    await sequelize.sync({ force: true }); 

    // -------------------- SEED USERS --------------------
    const users = [];
    for (let i = 0; i < 10; i++) {
      users.push(
        await User.create({
          name: faker.person.fullName(),
          username: faker.internet.userName().toLowerCase(),
          email: faker.internet.email().toLowerCase(),
          password_hash: faker.internet.password(), // Normally hashed, but using plain here
          skill_level: faker.helpers.arrayElement([
            "beginner",
            "intermediate",
            "advanced",
          ]),
          role: faker.helpers.arrayElement(["player", "organizer"]),
          rank: faker.number.int({ min: 1, max: 1000 }),
          games_played: faker.number.int({ min: 0, max: 100 }),
          games_won: faker.number.int({ min: 0, max: 50 }),
          tournaments_played: faker.number.int({ min: 0, max: 20 }),
          city: faker.location.city(),
          profile_pic: faker.image.avatar(),
          notifications_enabled: faker.datatype.boolean(),
        })
      );
    }
    console.log(`✅ Seeded ${users.length} Users`);

    // -------------------- SEED TOURNAMENTS --------------------
    const tournaments = [];
    for (let i = 0; i < 3; i++) {
      tournaments.push(
        await Tournament.create({
          name: faker.company.name() + " Open",
          organizer_id:
            users[faker.number.int({ min: 0, max: users.length - 1 })].id,
          start_date: faker.date.soon({ days: 10 }),
          end_date: faker.date.soon({ days: 20 }),
          location: faker.location.city(),
          status: faker.helpers.arrayElement([
            "upcoming",
            "ongoing",
            "completed",
          ]),
        })
      );
    }
    console.log(`✅ Seeded ${tournaments.length} Tournaments`);

    // -------------------- SEED GAMES --------------------
    const games = [];
    for (let i = 0; i < 5; i++) {
      const player1 =
        users[faker.number.int({ min: 0, max: users.length - 1 })];
      let player2 = users[faker.number.int({ min: 0, max: users.length - 1 })];

      // Ensure player 1 and player 2 are different
      while (player2.id === player1.id) {
        player2 = users[faker.number.int({ min: 0, max: users.length - 1 })];
      }

      games.push(
        await Game.create({
          tournament_id: faker.helpers.arrayElement([
            null,
            ...tournaments.map((t) => t.id),
          ]), // Some games are from tournaments, others aren't
          player_1_id: player1.id,
          player_2_id: player2.id,
          score: `${faker.number.int({ min: 0, max: 7 })}-${faker.number.int({
            min: 0,
            max: 7,
          })}, ${faker.number.int({ min: 0, max: 7 })}-${faker.number.int({
            min: 0,
            max: 7,
          })}`,
          date: faker.date.recent({ days: 30 }),
          status: faker.helpers.arrayElement([
            "scheduled",
            "completed",
            "cancelled",
          ]),
        })
      );
    }
    console.log(`✅ Seeded ${games.length} Games`);

    // -------------------- SEED RANKINGS --------------------
    const rankings = [];
    for (const user of users) {
      rankings.push(
        await Ranking.create({
          user_id: user.id,
          points: faker.number.int({ min: 0, max: 2000 }),
          last_updated: faker.date.recent({ days: 10 }),
        })
      );
    }
    console.log(`✅ Seeded ${rankings.length} Rankings`);

    // -------------------- SEED NOTIFICATIONS --------------------
    const notifications = [];
    for (const user of users) {
      notifications.push(
        await Notification.create({
          user_id: user.id,
          message: `Hey ${user.name}, your next match is scheduled!`,
          read: faker.datatype.boolean(),
        })
      );
    }
    console.log(`✅ Seeded ${notifications.length} Notifications`);

    console.log("✅ Seeding Completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await sequelize.close();
    console.log("✅ Database connection closed!");
  }
};

// Run the seeding function
seedDatabase();
