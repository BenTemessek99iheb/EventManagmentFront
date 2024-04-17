import { Component, OnInit } from '@angular/core';
import { EventModel } from 'src/app/model/event-model';
import { EvenementService } from 'src/app/service/evenement.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';
import * as FileSaver from 'file-saver';
import 'jspdf-autotable';
import { Observable, map } from 'rxjs';
import { FileService } from 'src/app/service/file-service/file.service';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-evenement',
  templateUrl: './evenement.component.html',
  styleUrls: ['./evenement.component.css']
})
export class EvenementComponent implements OnInit {
  listEvents: EventModel[] = [];
  selectedEvent: EventModel = new EventModel();
  isUpdate = false;
  searchTitle: string = ''; 
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  fileInfos?: Observable<any>;
  private baseUrl = 'http://localhost:8089/api/v1/events';


  constructor(private evenementService: EvenementService,private uploadService: FileService,private http: HttpClient) { }

  
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

 

  ngOnInit(): void {
    this.loadEvents();
    this.fileInfos = this.uploadService.getFiles();

  }

  loadEvents(): void {
    this.evenementService.getEvents().subscribe(data => {
      this.listEvents = data;
    });
  }
  saveEvent(): void {
    if (!this.isValidEvent()) {
      return;
    }
  
    // Check if an image is selected
    if (this.selectedFiles) {
      this.uploadImageAndSaveEvent().subscribe(evenement => {
        this.evenementService.saveEvent(evenement).subscribe(() => {
          this.loadEvents();
          // Handle success message (optional)
        }, (error) => {
          console.error('Error saving event with image:', error);
        });
      });
    } else {
      // No image selected, save event without image URL
      this.evenementService.saveEvent(this.selectedEvent).subscribe(() => {
        this.loadEvents();
        // Handle success message (optional)
      }, (error) => {
        console.error('Error saving event without image:', error);
        // Consider displaying an error message to the user
      });
    }
  }
  
  
   upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.uploadService.getFiles();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          }
        });
      }

      this.selectedFiles = undefined;
    }
  }
  
  uploadImageAndSaveEvent(): Observable<EventModel> {
    const formData = new FormData();
    formData.append('file', this.selectedFiles.item(0));
  
    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'text' // Expect the response to be the image URL as a string
    });
  
    return this.http.request(req).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            // Handle upload progress (optional)
            break;
          case HttpEventType.Response:
            if (event.status === 200) {
              const imageUrl = event.body; // Get the uploaded image URL
  
              // Update the selectedEvent object with the image URL
              this.selectedEvent.url = imageUrl;
  
              // Return the entire updated selectedEvent object for saving
              return this.selectedEvent;
            } else {
              throw new Error('Upload failed'); // Handle upload errors
            }
        }
        return null; // Shouldn't reach here
      })
    );
  }
      

  saveEventWithImage(evenement: EventModel): void {
    this.uploadImageAndSaveEvent().subscribe(evenement => {
      this.evenementService.saveEvent(evenement).subscribe(() => {
      }, (error) => {
        console.error('Error saving event with image:', error);
      });
    });
  }
  

  saveEventWithoutImage(event: EventModel): void {
    this.evenementService.saveEvent(event).subscribe(() => {
      this.loadEvents();
      // Handle success message (optional)
    }, (error) => {
      console.error('Error saving event without image:', error);
      // Consider displaying an error message to the user
    });
  }
  


  deleteEvent(id: number): void {
    console.log('Deleting event with ID:', id);
    this.evenementService.deleteEvent(id).subscribe(() => {
      console.log('Event deleted successfully.');
      this.loadEvents();
    });
  }

  newEvent(): void {
    this.selectedEvent = new EventModel();
    this.isUpdate = false;
  }

  selectEvent(event: EventModel): void {
    this.selectedEvent = { ...event }; // Copy event object to avoid modifying original list
    this.isUpdate = true;
  }
  todayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Convertit la date en format ISO (YYYY-MM-DD)
  }
  isValidEvent(): boolean {
    // Vérifier si tous les champs sont remplis et ont une longueur supérieure à 3 caractères
    return (
      !!this.selectedEvent.titre &&
      this.selectedEvent.titre.trim().length >= 3 &&
      !!this.selectedEvent.description &&
      this.selectedEvent.description.trim().length >= 3 &&
      !!this.selectedEvent.dateEvt &&
      !!this.selectedEvent.salle &&
      this.selectedEvent.salle.trim().length >= 3
    );
    }
    exportToPDF() {
      const doc = new jsPDF();
    
      // Ajouter la ligne de titre
      const title = 'Liste des événements';
      doc.setFontSize(16);
      doc.text(title, 10, 10);
    
      // Ajouter la ligne de noms de colonnes
      const columnNames = 'Titre, Description, Date, Salle';
      doc.setFontSize(12);
      doc.text(columnNames, 10, 20);
    
      const listItems = this.listEvents.map((event, index) => {
        return `${index + 1}. Titre: ${event.titre}, Description: ${event.description}, Date: ${event.dateEvt}, Salle: ${event.salle}`;
      });
    
      let yOffset = 30; // Position verticale de départ après les lignes de titre et de colonnes
    
      // Parcourir les éléments de la liste
      listItems.forEach(item => {
        doc.text(item, 10, yOffset); // Ajouter chaque élément à la position actuelle
        yOffset += 10; // Augmenter la position verticale pour le prochain élément
      });
    
      doc.save('liste_evenements.pdf');
    }
    searchEvents(): void {
      if (this.searchTitle.trim() === '') {
        // Si le champ de recherche est vide, charger tous les événements
        this.loadEvents();
      } else {
        // Filtrer la liste d'événements en fonction du titre
        this.listEvents = this.listEvents.filter(event =>
          event.titre.toLowerCase().includes(this.searchTitle.toLowerCase())
        );
      }
    }
  
        
    
    
    }