function assignTasksWithPriorityAndDependencies(developers, tasks) {
  // Initialize assigned tasks and remaining work hours for each developer
  let result = developers.map((dev) => ({
    ...dev,
    assignedTasks: [],
    totalHours: 0,
  }));

  // Track unassigned tasks
  let unassignedTasks = [];

  // Sort tasks by priority (higher priority first)
  tasks.sort((a, b) => b.priority - a.priority);

  // Track completed tasks
  let completedTasks = new Set();

  for (let task of tasks) {
    let taskAssigned = false;

    // Check if all dependencies are completed
    const dependenciesMet = task.dependencies.every((dep) =>
      completedTasks.has(dep)
    );

    // If the task depends on another task(means it can't be assigned at the moment), add to unassignedTasks
    if (!dependenciesMet) {
      unassignedTasks.push(task);
      continue;
    }

    // Assigning the task to a suitable developer
    for (let dev of result) {
      const hoursAvailable = dev.maxHours - dev.totalHours;
      const isPreferred = dev.preferredTaskType === task.taskType;
      const skillSufficient = dev.skillLevel >= task.difficulty;

      if (
        hoursAvailable >= task.hoursRequired &&
        skillSufficient &&
        isPreferred
      ) {
        dev.assignedTasks.push(task.taskName);
        dev.totalHours += task.hoursRequired;
        completedTasks.add(task.taskName);
        taskAssigned = true;
        break;
      }
    }

    // If task is not assigned based on developer preference, assign it based on skill
    if (!taskAssigned) {
      for (let dev of result) {
        const hoursAvailable = dev.maxHours - dev.totalHours;
        const skillSufficient = dev.skillLevel >= task.difficulty;

        if (hoursAvailable >= task.hoursRequired && skillSufficient) {
          dev.assignedTasks.push(task.taskName);
          dev.totalHours += task.hoursRequired;
          completedTasks.add(task.taskName);
          taskAssigned = true;
          break;
        }
      }
    }

    // If the task still couldn't be assigned, add to unassignedTasks
    if (!taskAssigned) {
      unassignedTasks.push(task);
    }
  }

  return {
    developers: result,
    unassignedTasks: unassignedTasks.map((task) => task.taskName),
  };
}

module.exports = { assignTasksWithPriorityAndDependencies };
