import { ViewChild, ElementRef, Component, signal } from '@angular/core';
import { IonCardContent, IonButton, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonCard, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
/* Importe la función y el ícono */
import { addIcons } from 'ionicons';
import { cloudUploadOutline } from 'ionicons/icons';
import { PercentPipe } from '@angular/common';
import { TeachablemachineService } from '../services/teachablemachine.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonButton, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonCard, IonHeader, IonToolbar, IonTitle, IonContent, PercentPipe,],
})
export class Tab1Page {
  predictions: any[] = [];
  /* Declare la referencia al elemento con el id image */
  @ViewChild('image', { static: false }) imageElement!: ElementRef<HTMLImageElement>;

  imageReady = signal(false)
  imageUrl = signal("")

  /* Declare los atributos para almacenar el modelo y la lista de clases */
  modelLoaded = signal(false);
  classLabels: string[] = [];
  constructor(private teachableMachine: TeachablemachineService) {
    addIcons({ cloudUploadOutline });
  }

  /* El método onSubmit para enviar los datos del formulario mediante el servicio */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      // Convertir el archivo a una URL base64 para mostrarlo en el html
      reader.onload = () => {
        console.log(reader.result as string)
      };

      reader.readAsDataURL(file); // Leer el archivo como base64
      // Convertir el archivo a una URL base64 para mostrarlo en el html
      reader.onload = () => {
        this.imageUrl.set(reader.result as string)
        this.imageReady.set(true)
      };
    }
  }

  /* Método ngOnInit para cargar el modelo y las clases */
  async ngOnInit() {
    await this.teachableMachine.loadModel()
    this.classLabels = this.teachableMachine.getClassLabels()
    this.modelLoaded.set(true)
  }

  async predict() {
    try {
        const image = this.imageElement.nativeElement;
        this.predictions = await this.teachableMachine.predict(image);
    } catch (error) {
        console.error(error);
        alert('Error al realizar la predicción.');
    }
}

}
