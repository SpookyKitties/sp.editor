import { Injectable } from '@angular/core';
import { NavigationService } from './navigation.service';
@Injectable()
export class ChapterService {
  public bodyBlock: string;
  public notes: string;
  constructor(private navService: NavigationService) {}

  public getChapter(book: string, chapter: string): void {
    const url = this.navService.getChapter(book, chapter);

    url.subscribe(u => {
      const addressBar = document.getElementById('addressBar');
      const parser = new DOMParser();
      const doc = parser.parseFromString(u, 'text/html');

      this.bodyBlock = this.extractHtml(doc, 'div.body-block');
      this.notes = this.extractHtml(doc, 'footer.study-notes');
      (addressBar as HTMLInputElement).value = book + '/' + chapter;
    });
  }

  private extractHtml(doc: Document, selector: string): string {
    return doc.querySelector(selector).innerHTML;
  }
}
