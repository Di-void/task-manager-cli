import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import ora from "ora";

const prisma = new PrismaClient();

export default async function readTask() {
  try {
    const spinner = ora("Fetching all todos...").start();

    const todos = await prisma.todo.findMany();

    spinner.stop();

    if (todos.length === 0) {
      console.log(chalk.blueBright("You do not have any tasks yet!"));
    } else {
      todos.forEach((todo) => {
        console.log(
          chalk.cyanBright("Todo Code: ") +
            todo.id +
            "\n" +
            chalk.blueBright("Name: ") +
            todo.name +
            "\n" +
            chalk.yellowBright("Description: ") +
            todo.detail +
            "\n"
        );
      });
    }
  } catch (error) {
    console.log("Something went wrong. Error: ", error);
    process.exit(1);
  }
}
