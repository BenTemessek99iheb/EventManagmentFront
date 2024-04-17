import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EventModel } from 'src/app/model/event-model'; // Assurez-vous d'importer le modèle EventModel
import { EvenementService } from 'src/app/service/evenement.service'; // Assurez-vous d'importer le service EvenementService

@Component({
  selector: 'app-evenement-user',
  templateUrl: './evenement-user.component.html',
  styleUrls: ['./evenement-user.component.css']
})
export class EvenementUserComponent {
  events: EventModel[] = [];
  message: string = ''; // Variable pour stocker le message
  showShareMenu: boolean = false; // Déclarez la propriété showShareMenu ici
  isLoading = false; // Flag to indicate image loading

  constructor(private evenementService: EvenementService,private router:Router,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.loadEvents();
  }
  handleError(error: any) {
    this.isLoading = false;
    console.error('Error loading image:', error);
    // Optionally display a message to the user, e.g., "Image unavailable"
  }
  loadEvents(): void {
    this.isLoading = true;
    this.evenementService.getEvents().subscribe(data => {
        this.events = data.map(event => {
            const relativePath = event.url;
            const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://drive.google.com/drive/folders/1J41NQ5-0WQRgp5FCwaMgIArOY0KAZ12i${relativePath}`);
            event.safeUrl = safeUrl; // Assign directly to event object
            return event;  // Return the updated event
        });
        this.isLoading = false;
    }, error => {
        this.handleError(error);  // Handle error
    });
}


  participer(event: EventModel): void {
    event.isPulsating = true;
    event.pulseButton = 'participer';
   
    this.router.navigate(['/PartciperEvent', event.idEvenement]); // Pass event ID as route parameter
  
  }
  like(event: EventModel): void {
    event.isPulsating = true;
    event.pulseButton = 'like';
    this.evenementService.likeEvent(event.idEvenement).subscribe(() => {
      console.log('Like pour l\'événement : ', event);
      event.message = 'Like ajouté avec succès !'; // Mettre à jour le message de l'événement
      setTimeout(() => {
        event.message = ''; // Effacer le message après quelques secondes
      }, 3000); // Temps en millisecondes
    });
  }
  
  dislike(event: EventModel): void {
    event.isPulsating = true;
    event.pulseButton = 'dislike';
    this.evenementService.dislikeEvent(event.idEvenement).subscribe(() => {
      console.log('Dislike pour l\'événement : ', event);
      event.message = 'Dislike ajouté avec succès !'; // Mettre à jour le message de l'événement
      setTimeout(() => {
        event.message = ''; // Effacer le message après quelques secondes
      }, 3000); // Temps en millisecondes
    });
  }
  shareOnFacebook(event: EventModel): void {
    // Construction de l'URL de partage
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(event.url)}`;
    // Ouvrir la fenêtre de partage Facebook dans une nouvelle fenêtre
    window.open(shareUrl, '_blank');
  }

  shareOnInstagram(event: EventModel): void {
    // Construction de l'URL de partage
    const shareUrl = `https://www.instagram.com/share?url=${encodeURIComponent(event.url)}`;
    // Ouvrir la fenêtre de partage Instagram dans une nouvelle fenêtre
    window.open(shareUrl, '_blank');
  }
  toggleShareMenu(): void {
    this.showShareMenu = !this.showShareMenu;
  }
  
  

}
