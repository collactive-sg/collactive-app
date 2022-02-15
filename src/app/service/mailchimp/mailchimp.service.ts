import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailchimpService {
  url
  constructor(private http: HttpClient) {
    this.url = environment.mailchimpURL;
   }
   subscribeToList(data) {
    const params = new HttpParams()
      .set('EMAIL', data.email)
    const mailChimpUrl = `${this.url}&${params.toString()}`;
    return this.http.jsonp(mailChimpUrl, 'c')
  }
}