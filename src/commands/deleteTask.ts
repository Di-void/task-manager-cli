import { prisma } from "./addTask.js";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

export async function getTaskId() {
  try {
    const answers = await inquirer.prompt([
      {
        name: "id",
        message: "Enter the id of the todo: ",
        type: "input",
      },
    ]);

    answers.id = answers.id.trim();

    return answers as { id: string };
  } catch (error) {
    console.log("Something went wrong...\n", error);
    process.exit(1);
  }
}

export default async function deleteTask() {
  try {
    const userCode = await getTaskId();

    const spinner = ora("Finding and Deleting the todo...").start();

    await prisma.todo.delete({
      where: {
        id: userCode?.id,
      },
    });

    spinner.stop();

    console.log(chalk.greenBright("Deleted Task successfully!"));
  } catch (error) {
    console.log(
      chalk.redBright(
        "\nCould not find any todo matching the provided name. Deletion failed."
      )
    );
    process.exit(1);
  }
}
