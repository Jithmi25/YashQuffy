import bcrypt from "bcrypt";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("user").del();
  await knex("user").insert([
    {
      id: "c784dd78-b26e-4cc0-9c8a-b84bdb4330b9",
      first_name: "John",
      last_name: "Smith",
      email: "johnS@gmail.com",
      password: bcrypt.hashSync("Test@123",10),
      balance: 200,
      is_admin: false,
    },
    {
      id: "da9347a6-2a7f-4573-be27-15f05569fb0d",
      first_name: "Matt",
      last_name: "Damon",
      email: "mattD@gmail.com",
      password: bcrypt.hashSync('Test@123',10),
      balance: 800,
      is_admin: true,
    },
    {
      id: "fce17e94-3415-4c08-b2c9-beddba191b4d",
      first_name: "Ben",
      last_name: "Affleck",
      email: "benA@gmail.com",
      password: bcrypt.hashSync('Test@123',10),
      balance:1200,
      is_admin: false,
    },
    {
      id: "4fd09491-2299-4684-a4fb-d7ca0bb074eb",
      first_name: "Tom",
      last_name: "Cruise",
      email: "tomC@gmail.com",
      password: bcrypt.hashSync('Test@123',10),
      balance:800,
      is_admin: false,
    },
    {
      id: "999da33d-74c3-4176-bb26-98c53215a71c",
      first_name: "Will",
      last_name: "Smith",
      email: "willS@gmail.com",
      password: bcrypt.hashSync('Test@123',10),
      balance:1500,
      is_admin: false,
    },
    {
      id: "4a90e4f3-d695-4c54-a698-099cdb39e4ad",
      first_name: "Denzel",
      last_name: "Washington",
      email: "danzelW@gmail,com",
      password: bcrypt.hashSync('Test@123',10),
      balance:550,
      is_admin: false,
    },
    {
      id: "1ebd273d-9b35-4f9f-a96e-6e0c09194d1f",
      first_name: "Tom",
      last_name: "Brady",
      email: "tomB@gmail.com",
      password: bcrypt.hashSync('Test@123',10),
      balance:1200,
      is_admin: false,
    },
    {
      id:"52ef9366-6e86-4498-be32-a33087d03670",
      first_name: "Lebron",
      last_name: "James",
      email: "lebronJ@gmail.com",
      password: bcrypt.hashSync('Test@123',10),
      balance:2000,
      is_admin: false,
    },
    {
      id: "7dfcf073-99b9-4ed0-9458-600484a2e265",
      first_name:"Lewis",
      last_name:"Hamilton",
      email:"lewisH@gmail.com",
      password: bcrypt.hashSync('Test@123',10),
      balance:250,
      is_admin: false,
    },
    {
      id:"fe1f120c-85a1-4d83-9ebd-ef993951c51c",
      first_name:"Michael",
      last_name:"Jordan",
      email:"michealJ@gmail.com",
      password: bcrypt.hashSync('Test@123',10),
      balance:1350,
      is_admin: false,
    }

  ]);
}

