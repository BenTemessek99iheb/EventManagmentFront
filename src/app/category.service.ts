import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';  

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://localhost:8080/api/v1';  
  
  constructor(private http:HttpClient) { }  
  
  getCategoryList(): Observable<any> {  
    return this.http.get(`${this.baseUrl}`+'/category');  
  }  
  
  createCategory(category: object): Observable<object> {  
    return this.http.post(`${this.baseUrl}`+'/category', category);  
  }  
  
  getcategory(id: number): Observable<Object> {  
    return this.http.get(`${this.baseUrl}/category/${id}`);  
  }  
    
}  
