
import { LightningElement } from 'lwc';

const STORAGE_KEY = 'simpleTodoListTasks';

export default class TodoList extends LightningElement {
    newTask = '';
    tasks = [];
    nextId = 1;

    connectedCallback() {
        try {
            const savedTasks = window.localStorage.getItem(STORAGE_KEY);

            if (savedTasks) {
                const parsedTasks = JSON.parse(savedTasks);

                if (Array.isArray(parsedTasks)) {
                    this.tasks = parsedTasks
                        .filter(task =>
                            task &&
                            typeof task.name === 'string' &&
                            typeof task.completed === 'boolean'
                        )
                        .map(task => ({
                            id: task.id,
                            name: task.name,
                            completed: task.completed,
                            cssClass: task.completed
                                ? 'task-name completed'
                                : 'task-name'
                        }));

                    const maxId = this.tasks.reduce(
                        (max, task) =>
                            Math.max(max, Number(task.id) || 0),
                        0
                    );

                    this.nextId = maxId + 1;
                }
            }
        } catch (error) {
            console.error('Unable to load saved tasks:', error);
        }
    }

    handleInputChange(event) {
        this.newTask = event.target.value;
    }

    addTask() {
        const taskName = this.newTask.trim();

        if (!taskName) {
            return;
        }

        const task = {
            id: this.nextId++,
            name: taskName,
            completed: false,
            cssClass: 'task-name'
        };

        this.tasks = [...this.tasks, task];
        this.newTask = '';

        this.saveTasks();
    }

    toggleTask(event) {
        const taskId = Number(event.target.dataset.id);
        const isCompleted = event.target.checked;

        this.tasks = this.tasks.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    completed: isCompleted,
                    cssClass: isCompleted
                        ? 'task-name completed'
                        : 'task-name'
                };
            }

            return task;
        });

        this.saveTasks();
    }

    deleteTask(event) {
        const taskId = Number(event.currentTarget.dataset.id);

        this.tasks = this.tasks.filter(
            task => task.id !== taskId
        );

        this.saveTasks();
    }

    saveTasks() {
        try {
            const data = this.tasks.map(
                ({ id, name, completed }) => ({
                    id,
                    name,
                    completed
                })
            );

            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(data)
            );
        } catch (error) {
            console.error('Unable to save tasks:', error);
        }
    }

    get totalTasks() {
        return this.tasks.length;
    }

    get completedTasks() {
        return this.tasks.filter(task => task.completed).length;
    }

    get pendingTasks() {
        return this.totalTasks - this.completedTasks;
    }

    get hasTasks() {
        return this.tasks.length > 0;
    }
}
