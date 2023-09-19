#! /usr/bin/env node

import addTask from "./commands/addTask.js";
import deleteTask from "./commands/deleteTask.js";
import readTask from "./commands/readTask.js";
import updateTask from "./commands/updateTask.js";

import { Command } from "commander";

const program = new Command();

program
  .name("Task Manager")
  .version("1.0.0")
  .description("Simple CLI to help manage your tasks or todos");

program.command("add").description("Creates a new todo").action(addTask);

program.command("read").description("Reads all tasks").action(readTask);

program.command("update").description("Update a task").action(updateTask);

program.command("delete").description("Delete a task").action(deleteTask);

program.parse();
