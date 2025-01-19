
import { Component } from '@angular/core';
import {
   IonCard, IonCardHeader, IonCardTitle, IonCardContent,
   IonSelect, IonSelectOption, IonTextarea, IonButton,
   IonList, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle,IonAvatar , IonContent, IonIcon
} from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProviderService } from '../services/provider.service';

@Component({
   selector: 'app-tab3',
   templateUrl: 'tab3.page.html',
   styleUrls: ['tab3.page.scss'],
   standalone: true,
   imports: [ReactiveFormsModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon,
      IonSelect, IonSelectOption, IonTextarea, IonButton,
      IonList, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonAvatar, IonContent]
})
export class Tab3Page {
   dataList: any[] = [];
   collectionName = 'reviews';
   myForm: FormGroup = new FormGroup({
      score: new FormControl("", Validators.required),
      opinion: new FormControl("", Validators.required)
   });

   constructor(private providerService: ProviderService) { }
   onSubmit() {
      this.providerService.createDocument(this.collectionName, this.myForm.value).then(() => {
         this.myForm.reset()
      });
   }

   /* Al inicializar, carga los datos  */
   ngOnInit() {
      this.loadData();
   }

   loadData() {
      this.providerService.readCollection(this.collectionName).subscribe((data) => {
         this.dataList = data;
      });
   }
}
