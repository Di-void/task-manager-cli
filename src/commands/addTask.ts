import { PrismaClient, Prisma } from "@prisma/client";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

const prisma = new PrismaClient();

export default async function addTask() {
  try {
    const userResponse = await askQuestions();

    let spinner = ora("Creating the todos...").start();

    for (let i = 0; i < userResponse.length; i++) {
      const { name, detail } = userResponse[i];
      await prisma.todo.create({
        data: {
          name,
          detail,
        },
      });
    }

    spinner.stop();
    console.log(chalk.greenBright("Created the Todos :)"));
  } catch (error) {
    console.log("Something went wrong, Error: ", error);
    process.exit(1);
  }
}

async function input(): Promise<
  Omit<Prisma.TodoCreateInput, "id" | "createdAt" | "updatedAt" | "status">
> {
  const answers = await inquirer.prompt([
    { name: "name", message: "Enter the name of the task:", type: "input" },
    {
      name: "detail",
      message: "Enter the details of the task:",
      type: "input",
    },
  ]);

  return answers;
}

const askQuestions = async () => {
  const todosArray = [];
  let loop = false;

  do {
    const userRes = await input();
    todosArray.push(userRes);
    const confirmQ = await inquirer.prompt([
      {
        name: "confirm",
        message: "Do you want to add more tasks?",
        type: "confirm",
      },
    ]);
    if (confirmQ.confirm) {
      loop = true;
    } else {
      loop = false;
    }
  } while (loop);

  return todosArray;
};
