
import { Component, OnInit} from '@angular/core';
import {
   IonCard, IonButtons, IonCardHeader, IonCardTitle, IonCardContent,
   IonSelect, IonSelectOption, IonTextarea, IonButton,
   IonList, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle,IonAvatar , IonContent, IonIcon,
   IonNote,
   IonCheckbox,
   IonGrid,
   IonRow,
   IonCol
} from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProviderService } from '../services/provider.service';
import { CommonModule } from '@angular/common';


interface Event {
   title: string;
   date: string;
   time: string;
   proposedBy: string;
   attendees: number;
 }
 
 interface Activity {
   timeRange: string;
   description: string;
   completed: boolean;
 }
 

@Component({
   selector: 'app-tab2',
   templateUrl: 'tab2.page.html',
   styleUrls: ['tab2.page.scss'],
   standalone: true,
   imports: [CommonModule, IonButtons, IonGrid, IonRow, IonCol, IonNote, IonCheckbox, ReactiveFormsModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon,
      IonSelect, IonSelectOption, IonTextarea, IonButton,
      IonList, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonAvatar, IonContent]
})
export class Tab2Page implements OnInit {
   todayDate: Date = new Date();
   currentTime: string = '';  updateCurrentTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
 
   upcomingEvents: Event[] = [];
   activityHistory: Activity[] = [];
   todayActivities: Activity[] = [];
 
   constructor() {}
 
   ngOnInit() {
     // Simulación de carga de datos
     this.loadUpcomingEvents();
     this.loadActivityHistory();
     this.loadTodayActivities();
   }
 
   // Métodos para cargar datos simulados
   loadUpcomingEvents() {
     this.upcomingEvents = [
       {
         title: 'Salir al parque',
         date: '11/11',
         time: '6 PM',
         proposedBy: 'Juan',
         attendees: 2,
       },
       {
         title: 'Recital de Sofía',
         date: '20/11',
         time: '9 PM',
         proposedBy: 'María',
         attendees: 4,
       },
     ];
   }
 
   loadActivityHistory() {
     this.activityHistory = [
       {
         timeRange: '9:00 AM - 11:00 PM',
         description: 'Movie night',
         completed: true,
       },
       {
         timeRange: '10:00 AM - 3:00 PM',
         description: 'Festival: Samanes',
         completed: true,
       },
     ];
   }
 
   loadTodayActivities() {
     this.todayActivities = [
       {
         timeRange: '9:00 AM - 11:00 PM',
         description: 'Visita familiar',
         completed: false,
       },
       {
         timeRange: '10:00 AM - 3:00 PM',
         description: 'Ir al parque',
         completed: false,
       },
     ];
   }
 
   // Método para agregar una nueva actividad al historial
   addActivityToHistory(activity: Activity) {
     activity.completed = true;
     this.activityHistory.push(activity);
     this.todayActivities = this.todayActivities.filter(
       (a) => a !== activity
     );
   }
 }