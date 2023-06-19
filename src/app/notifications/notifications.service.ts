import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

export interface Command {
  id: number;
  type: 'success' | 'error' | 'clear';
  // optional in case clearMessage()
  text?: string;
}

@Injectable({
  providedIn: 'root',
})

export class NotificationsService {
  // the subject is multicast, but
  // if you chain on a pipe statemant to it,
  // that's going to return a new OBSERVABLE!!!
  // and that's new OBSERVABLE!!! that is COLD and UNICAST!!!
  // THAT'S SUPER UNEXPECTED BEHAVIOUR with SUBJECT
  messagesInput: Subject<Command>;
  messagesOutput: Observable<Command[]>;

  constructor() {
    // subject is listening before we call below methods

    // taking result of calling pipe on messagesInput
    // and assign it to messagesOutput

    // we need to know how that observable messageOutput
    // get data out of pipe statemant, but
    // but simultaneously we need to hold on to the subject as well
    // because a subject is the only way that we can get data into
    // our pipeline...
    this.messagesInput = new Subject<Command>();
    this.messagesOutput = this.messagesInput.pipe(
      scan((acc: Command[], value: Command) => {
        if (value.type === 'clear') {
          // return acc[] and it is going to keep any of them+56
          // that doesn't have an ID equal to the message.id
          return acc.filter(message => message.id !== value.id);
        } else {
          return [...acc, value];
        }
      }, [])
    );
  }

  addSuccess(message: string) {
    const id = this.randomId();
    // calling next is throwing new value into subject
    this.messagesInput.next({
      id,
      text: message,
      type: 'success',
    });

    setTimeout(() => {
      this.clearMessage(id);
    }, 5000);
  }

  addError(message: string) {
    const id = this.randomId();

    this.messagesInput.next({
      id,
      text: message,
      type: 'error',
    });

    setTimeout(() => {
      this.clearMessage(id);
    }, 5000);
  }

  clearMessage(id: number) {
    this.messagesInput.next({
      // id: id
      id,
      type: 'clear',
    });
  }

  private randomId() {
    return Math.round(Math.random() * 10000);
  }
}
