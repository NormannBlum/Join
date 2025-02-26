import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

import { TaskServiceService } from '../../../services/task-service.service';
import { ContactsService } from '../../../services/contacts.service';
import { Task } from '../../../../interfaces/task';

@Component({
  selector: 'app-single-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-task.component.html',
  styleUrl: './single-task.component.scss',
})
export class SingleTaskComponent {
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  isOverlayOpen = false;
  selectedContacts: any[] = [];

  @Input() task!: Task;

  constructor(private taskService: TaskServiceService, public contactService: ContactsService) {
    this.tasks = this.taskService.todoList;
  }

  openOverlay(task: Task) {
    this.selectedTask = task;
    this.isOverlayOpen = true;
  }

  closeOverlay() {
    this.isOverlayOpen = false;
  }

  /**
   * Handles the drag-and-drop functionality for tasks.
   * Moves items within the same list or transfers them between different lists.
   *
   * @param {CdkDragDrop<Task[]>} event - The drag-and-drop event containing task data.
   */
  async drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // console.log(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task: Task = event.previousContainer.data[event.previousIndex];
      const previousCategory = this.getCategoryFromContainer(
        event.previousContainer
      );
      const newCategory = this.getCategoryFromContainer(event.container);

      console.info('----- selected Task Board TS -------');
      console.log(task);
      console.log('Wo soll es hin: ', newCategory);

      /**
       * Adds the task to the new category in the database.
       * This ensures that the task is properly stored under its new status.
       *
       * @param {string} newCategory - The category to which the task is being moved.
       * @param {Task} task - The task being updated.
       */
      await this.taskService.addTask(newCategory, task);

      /**
       * Removes the task from its previous category in the database.
       * This prevents duplicate tasks from appearing across different categories.
       *
       * @param {string} previousCategory - The category from which the task is being removed.
       * @param {string} task.id - The unique identifier of the task.
       */
      if (task.id) {
        console.log('Woher kam es: ', previousCategory);
        await this.taskService.deleteTask(previousCategory, task.id);
      }

      // Aktualisiere die lokalen Arrays
      // transferArrayItem(
      //   event.previousContainer.data,
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex
      // );

      // console.log(
      //   event.previousContainer.data,
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex,
      // );
    }
  }

  /**
   * Determines the category of a task based on the provided drop list container.
   *
   * @param {CdkDropList} container - The drag-and-drop container.
   * @returns {string} - The category of the task.
   */
  getCategoryFromContainer(container: CdkDropList): string {
    if (container.data === this.taskService.todoList) return 'todo';
    if (container.data === this.taskService.progressList) return 'inprogress';
    if (container.data === this.taskService.feedbackList) return 'feedback';
    if (container.data === this.taskService.doneList) return 'done';
    return '';
  }

  /**
   * Finds the index of a contact in the full contact list based on the contact's email.
   *
   * @param {Object} contact - The contact whose index is to be found.
   * @param {string} contact.email - The email address of the contact to search for.
   *
   * @returns {number} - Returns the index of the contact in the contact list, or `-1` if the contact is not found.
   */
  getIndexInFullList(contact: any): number {
    return this.contactService.contactList.findIndex(
      (c) => c.email === contact.email
    );
  }
}

// test() {
//   console.log(this.taskService.taskList);
// }

// getSub(sub: any) {
//   console.log("Ergebnis: ", sub);
// }
