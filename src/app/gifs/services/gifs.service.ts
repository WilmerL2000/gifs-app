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

  /**
   * The `organizeHistory` function takes a tag as input, converts it to lowercase, removes any
   * occurrences of the tag from the `_tagsHistory` array, adds the tag to the beginning of the array,
   * keeps only the first 10 elements of the array, and saves the updated array to local storage.
   * @param {string} tag - The `tag` parameter is a string that represents a tag to be organized in the
   * history.
   */
  private organizeHistory(tag: string): void {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter(oldTag => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);

    this.saveLocalStorage();

  }

  /* The `saveLocalStorage()` function is responsible for saving the `_tagsHistory` array to the
  browser's local storage. It uses the `localStorage.setItem()` method to store the array as a string
  with the key 'history'. */
  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!)

    if (this.tagsHistory.length === 0) return;

    this.searchTag(this._tagsHistory[0])

  }

  /**
   * The searchTag function takes a tag as input, organizes the search history, and makes an HTTP request
   * to retrieve a list of GIFs based on the tag.
   * @param {string} tag - The `tag` parameter is a string that represents the search tag for the GIFs.
   * It is used to search for GIFs related to the specified tag.
   * @returns a Promise of type `void`.
   */
  public async searchTag(tag: string): Promise<void> {

    if (tag.length === 0) return;
    this.organizeHistory(tag);

    this.http.get<SearchResponse>(`${this.serviceUrl}/search?api_key=${this.apiKey}&q=${tag}&limit=10`)
      .subscribe(resp => { this.gifList = resp.data })

  }
}
