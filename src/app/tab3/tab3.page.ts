
import { Component } from '@angular/core';
import {
   IonCard, IonCardHeader, IonCardTitle, IonCardContent,
   IonSelect, IonSelectOption, IonTextarea, IonButton,
   IonList, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle,IonAvatar , IonContent, IonIcon
} from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProviderService } from '../services/provider.service';
import { CommonModule } from '@angular/common';

@Component({
   selector: 'app-tab3',
   templateUrl: 'tab3.page.html',
   styleUrls: ['tab3.page.scss'],
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon,
      IonSelect, IonSelectOption, IonTextarea, IonButton,
      IonList, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonAvatar, IonContent]
})
export class Tab3Page {
   dataList: any[] = [];
   collectionName = 'feedback';
   feedbackForm: FormGroup = new FormGroup({
      emotion: new FormControl("", Validators.required),
   });

   constructor(private providerService: ProviderService) { }

   ngOnInit() {
      this.loadData();
   }

   loadData() {
      this.providerService.readCollection(this.collectionName).subscribe((data) => {
         this.dataList = data;
      });
   }
   
  getEmoji(emotion: string): string {
   const emojiMap: { [key: string]: string } = {
     'anger': '😡',       // Enojo
     'contempt': '😒',    // Desdén
     'disgust': '🤢',     // Asco
     'fear': '😨',        // Miedo
     'happy': '😊',       // Felicidad
     'neutral': '😐',     // Neutral
     'sad': '😢',         // Tristeza
   };
   return emojiMap[emotion] || '❓';
 }
}
