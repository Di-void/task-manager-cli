import { prisma } from "./addTask.js";
import type { Todo } from "@prisma/client";
import { getTaskId } from "./deleteTask.js";
import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";

const lookup = {
  completed: true,
  pending: false,
};

async function askUpdateQ(todo: Omit<Todo, "createdAt" | "updatedAt" | "id">) {
  const status = todo.status ? "completed" : "pending";
  try {
    const update = await inquirer.prompt([
      {
        name: "name",
        message: "Update the name?",
        type: "input",
        default: todo.name,
      },
      {
        name: "detail",
        message: "Update the description?",
        type: "input",
        default: todo.detail,
      },
      {
        name: "status",
        message: "Update the status?",
        type: "list",
        choices: ["pending", "completed"],
        default: status,
      },
    ]);

    return update as {
      name: string;
      detail: string;
      status: "completed" | "pending";
    };
  } catch (error) {
    console.log("Something went wrong... \n", error);
  }
}

export default async function updateTask() {
  try {
    const { id } = await getTaskId();

    let spinner = ora("Finding your task...").start();

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve("hello");
      }, 2000);
    });

    const task = await prisma.todo.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        detail: true,
        status: true,
      },
    });

    if (!task) {
      console.log(chalk.redBright("\nTask with this id not found."));
      process.exit(1);
    }

    spinner.stop();
    const answers = await askUpdateQ(task);

    spinner.start("Updating your task...");

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve("hello");
      }, 2000);
    });

    await prisma.todo.update({
      where: {
        id,
      },
      data: {
        name: answers?.name,
        detail: answers?.detail,
        status: lookup[answers?.status!],
      },
    });

    spinner.stop();

    console.log(chalk.greenBright("Task updated successfully :)"));
  } catch (error) {
    console.log(chalk.redBright("\nSomething went wrong :("), error);
    process.exit(1);
  }
}
