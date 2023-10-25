import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = []

  private _tagsHistory: string[] = [];
  private apiKey: string = 'GrrTwbEVnMAvyCWO4V1ObfsLH8b507FG'
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs'

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory(): string[] {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string): void {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter(oldTag => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);

    this.saveLocalStorage();

  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!)

    if (this.tagsHistory.length === 0) return;

    this.searchTag(this._tagsHistory[0])

  }

  public async searchTag(tag: string): Promise<void> {

    if (tag.length === 0) return;
    this.organizeHistory(tag);

    this.http.get<SearchResponse>(`${this.serviceUrl}/search?api_key=${this.apiKey}&q=${tag}&limit=10`)
      .subscribe(resp => { this.gifList = resp.data })

  }
}
