import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EvenementService } from '../service/evenement.service';
import { EventModel } from '../model/event-model';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from 'src/environment';


@Component({
  selector: 'app-participer-event',
  templateUrl: './participer-event.component.html',
  styleUrls: ['./participer-event.component.css']
})
export class ParticiperEventComponent implements OnInit {
  event: EventModel | null = null;
  errorMessage: string = ''; // Add property to store error message
  stripePromise = loadStripe(environment.stripe);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private evenementService: EvenementService // Inject EvenementService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const eventIdStr = params.get('eventId'); // Retrieve event ID from route (string)

      // Type assertion (assuming eventIdStr is always a valid number)
      const eventId = Number(eventIdStr); // Attempt to convert to number

      if (eventId) {
        this.evenementService.getEventById(eventId) // Call service method
          .subscribe(event => {
            this.event = event;
          },
          error => {
            this.errorMessage = 'Error fetching event details'; // Handle error
            console.error('Error fetching event details:', error);
          });
      }
    });
  }

  async handlePayment(): Promise<void> {
    if (!this.event || this.event.price <= 0) {
      console.error('Invalid event price for payment processing.');
      this.errorMessage = 'Event price cannot be zero or negative.'; // Inform user
      return;
    }


    const payment = {
      name: this.event.titre, // Use event title or relevant product/service name
      currency: 'usd', // Replace with your currency if needed
      amount: this.event.price * 100, // Convert price to cents for Stripe (multiply by 100)
      cancelUrl: 'http://localhost:4200/cancel', // Replace with your cancel URL
      successUrl: 'http://localhost:4200/success', // Replace with your success URL
      eventId: this.event.idEvenement,

    };

    try {
      // Call the service method to create payment intent
      const response = await this.evenementService.createPaymentIntent(payment).toPromise();
      const stripe = await this.stripePromise;
      stripe.redirectToCheckout({ sessionId: response?.id }); // Optional chaining for safer access
      console.log('Payment processed successfully!');
      this.event.nbparticipants++;

    } catch (error) {
      console.error('Error processing payment:', error);
      // Handle payment processing errors gracefully (e.g., display error message to user)
    }

  }
}
