import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
// import 'rxjs/add/operator/map';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // @Output() trainingStart = new EventEmitter<void>();
  exercises: Exercise[] = [];
  // exercises!: Observable<Exercise[]>;
  exercisesSubscription!: Subscription;

  constructor(private trainingService: TrainingService, private db: AngularFirestore) { }

  ngOnInit(): void {
    // this.exercises = this.trainingService.getAvailableExercises();

    // this.db.collection('availableExercises').valueChanges().subscribe(res => console.log(res));

    // this.db.collection('availableExercises').snapshotChanges().subscribe(res => {
    //   for (const r of res) { console.log(r.payload.doc.data()); }
    // });

    // this.exercises = this.db.collection('availableExercises').snapshotChanges().pipe(map(docArray => {
    //   return docArray.map(doc => {
    //     const data: any = doc.payload.doc.data() as Exercise;
    //     return { id: doc.payload.doc.id, ...data };
    //   });
    // }));
    this.exercisesSubscription = this.trainingService.exercisesChanged
      .subscribe(exercises => this.exercises = exercises);
    this.trainingService.fetchAvailableExercise();
  }

  onStartTraining(form: NgForm) {
    // this.trainingStart.emit();
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    this.exercisesSubscription.unsubscribe();
  }
}
