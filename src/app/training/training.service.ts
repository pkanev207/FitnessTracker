import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject } from 'rxjs';
import { Subscription } from "rxjs";
import { map } from 'rxjs/operators';
import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  // private availableExercises: Exercise[] = [
  //   { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
  //   { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 10 },
  //   { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
  //   { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 },
  // ];
  private availableExercises: Exercise[] = [];
  //   private runningExercise: any;
  private runningExercise?: Exercise;
  // private exercises: Exercise[] = [];
  // private finishedExercises: Exercise[] = [];
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore) { }

  // getAvailableExercises() {
  //   return this.availableExercises.slice();
  // }

  fetchAvailableExercise() {
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            const data: any = doc.payload.doc.data() as Exercise;
            return { id: doc.payload.doc.id, ...data };
          });
        })).subscribe({
          next: (exercises: Exercise[]) => {
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
          },
          error: error => console.log(error),
          complete: () => console.log('completed')
        }));
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/' + selectedId).update({ lastSelected: new Date() });
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    ) as Exercise;

    if (!this.runningExercise) return;

    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    // this.exercises.push({
    //   ...this.runningExercise!,
    //   date: new Date(),
    //   state: 'completed',
    // });

    this.addDataToDatabase({
      ...this.runningExercise!,
      date: new Date(),
      state: 'completed',
    });

    this.runningExercise = null!;
    this.exerciseChanged.next(null!);
  }

  cancelExercise(progress: number) {
    // this.exercises.push({
    //   ...this.runningExercise!,
    //   duration: this.runningExercise!.duration * (progress / 100),
    //   calories: this.runningExercise!.calories * (progress / 100),
    //   date: new Date(),
    //   state: 'cancelled',
    // });

    this.addDataToDatabase({
      ...this.runningExercise!,
      duration: this.runningExercise!.duration * (progress / 100),
      calories: this.runningExercise!.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });

    this.runningExercise = null!;
    this.exerciseChanged.next(null!);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  // getCompletedOrCancelledExercises() {
  //   return this.exercises.slice();
  // }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises) => {
        // this.finishedExercises = exercises as Exercise[];
        this.finishedExercisesChanged.next(exercises as Exercise[]);
      }));
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
