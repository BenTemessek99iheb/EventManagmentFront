import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventModel } from '../model/event-model';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {

  private baseUrl = 'http://localhost:8089/api/v1/events';

  constructor(private httpClient: HttpClient) { }

  getEvents(): Observable<EventModel[]> {
    return this.httpClient.get<EventModel[]>(`${this.baseUrl}/getEvent`);
  }
 


  saveEvent(event: EventModel): Observable<EventModel> {
    return this.httpClient.post<EventModel>(`${this.baseUrl}/addEvent`, event);
  }

  updateEvent(event: EventModel): Observable<EventModel> {
    return this.httpClient.put<EventModel>(`${this.baseUrl}/updateEvent`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/deleteEvent/${id}`);
  }

  getEventById(id: number): Observable<EventModel> {
    return this.httpClient.get<EventModel>(`${this.baseUrl}/getByIdEvent/${id}`);
  }
  likeEvent(eventId: number) {
    return this.httpClient.post(`${this.baseUrl}/${eventId}/like`, {});
  }

  dislikeEvent(eventId: number) {
    return this.httpClient.post(`${this.baseUrl}/${eventId}/dislike`, {});
  }
 
  createPaymentIntent(payment: { name: string; currency: string; amount: number; cancelUrl: string; successUrl: string }): Observable<any> {
    return this.httpClient.post('http://localhost:8089/api/payment', payment); 
  }
    
}
