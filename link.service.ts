import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  apiLink: string = "https://chiveneexpress.com/";
  consumer_key: string  = "ck_dd19e4e41610e152f9675eb2223f02488255d9f4";
  consumer_secret: string  = "cs_9549cdf99dcb858944f9a09e28baecadc949d6c4";  
  constructor() { }

  getAPILink() : string{
    return this.apiLink;
  }

  getConsumerKey(): string{
    return this.consumer_key;
  }

  getConsumerSecret(): string{
    return this.consumer_secret;
  }
}
