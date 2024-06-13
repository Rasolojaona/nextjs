const bcrypt = require('bcrypt');
const { db } = require('@vercel/postgres');

const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');

async function seedUsers(connection) {
  try {
    // Create the "users" table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );
    `);

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await connection.query(
          'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
          [user.id, user.name, user.email, hashedPassword]
        );
      })
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedInvoices(connection) {
  try {
    // Create the "invoices" table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id VARCHAR(36) PRIMARY KEY,
        customer_id VARCHAR(36) NOT NULL,
        amount INT NOT NULL,
        status VARCHAR(255) NOT NULL,
        date DATE NOT NULL
      );
    `);

    console.log(`Created "invoices" table`);

    // Insert data into the "invoices" table
    const insertedInvoices = await Promise.all(
      invoices.map(async (invoice) => {
        await connection.query(
          'INSERT INTO invoices (id, customer_id, amount, status, date) VALUES (?, ?, ?, ?, ?)',
          [invoice.id, invoice.customer_id, invoice.amount, invoice.status, invoice.date]
        );
      })
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(connection) {
  try {
    // Create the "customers" table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `);

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map(async (customer) => {
        await connection.query(
          'INSERT INTO customers (id, name, email, image_url) VALUES (?, ?, ?, ?)',
          [customer.id, customer.name, customer.email, customer.image_url]
        );
      })
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(connection) {
  try {
    // Create the "revenue" table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) PRIMARY KEY,
        revenue INT NOT NULL
      );
    `);

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(async (rev) => {
        await connection.query(
          'INSERT INTO revenue (month, revenue) VALUES (?, ?)',
          [rev.month, rev.revenue]
        );
      })
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  try {
    await connection.connect();

    await seedUsers(connection);
    await seedCustomers(connection);
    await seedInvoices(connection);
    await seedRevenue(connection);

    await connection.end();
  } catch (err) {
    console.error(
      'An error occurred while attempting to seed the database:',
      err
    );
  }
}

main();