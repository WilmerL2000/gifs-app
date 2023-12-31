import { Component } from '@angular/core';
import { GifsService } from 'src/app/gifs/services/gifs.service';
@Component({
  selector: 'shared-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private gifsServise: GifsService) { }

  get tags(): string[] {
    return this.gifsServise.tagsHistory;
  }

  searchTag(tag: string): void {
    this.gifsServise.searchTag(tag);
  }

}
