
import { ViewChild, ElementRef, Component, signal } from '@angular/core';
import { IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonCard, IonHeader, IonToolbar, IonTitle, IonContent, IonSelectOption, IonAvatar } from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { cloudUploadOutline, camera, personCircleOutline } from 'ionicons/icons';
import { PercentPipe } from '@angular/common';
import { TeachablemachineService } from '../services/teachablemachine.service';
import { Capacitor } from '@capacitor/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProviderService } from '../services/provider.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonAvatar, ReactiveFormsModule, CommonModule, IonCardHeader, IonCardTitle,
    IonCardContent, IonButton, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonCard,
    IonHeader, IonToolbar, IonTitle, IonContent, IonSelectOption, PercentPipe,]
})

export class Tab1Page {
  dataList: any[] = [];
  feedbackForm: FormGroup = new FormGroup({
    emotion: new FormControl('', Validators.required),
    timestamp: new FormControl('')
  });

  feedbackCollectionName = "feedback";
  predictions: any[] = [];
  highestProbability: number = 0;
  @ViewChild('image', { static: false }) imageElement!: ElementRef<HTMLImageElement>;

  imageReady = signal(false)
  imageUrl = signal("")

  modelLoaded = signal(false);
  classLabels: string[] = [];
  constructor(private teachableMachine: TeachablemachineService, private providerService: ProviderService) {
    addIcons({ personCircleOutline, cloudUploadOutline, camera });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

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
      this.highestProbability = Math.max(...this.predictions.map(pred => pred.probability));
      const bestPrediction = this.predictions.find(pred => pred.probability === this.highestProbability);

      if (bestPrediction) {
        const detectedEmotion = bestPrediction.className;
        this.feedbackForm.patchValue({ emotion: detectedEmotion });
        console.log(`Emoción detectada: ${detectedEmotion} (${this.highestProbability})`);
      }
    } catch (error) {
      console.error(error);
      alert('Error al realizar la predicción.');
    }
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

  async openCamera() {
    try {
      if (Capacitor.isNativePlatform()) {
        const permissions = await Camera.requestPermissions();

        if (permissions.camera === 'denied') {
          alert('Permiso de cámara denegado.');
          return;
        }
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        this.imageUrl.set(image.dataUrl);
        this.imageReady.set(true);
      }
    } catch (error) {
      console.error('Error al abrir la cámara:', error);
      alert('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  }


  onFeedbackSubmit() {

    if (this.feedbackForm.valid) {
      const feedbackData = {
        emotion: this.feedbackForm.value.emotion,
        timestamp: new Date().toISOString(),
      };

      this.providerService.createDocument(this.feedbackCollectionName, feedbackData).then(() => {
        this.feedbackForm.reset();
        alert('Comentario enviado con éxito');
      }).catch(error => {
        console.error('Error al enviar el comentario: ', error);
      });
    }
  }

}
