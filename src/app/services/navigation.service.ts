import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { JSDOM } from 'jsdom';
import { Observable } from 'rxjs';
import { Folder } from '../models/Folder';
import { FolderProtoType } from '../models/FolderProtoType';
import { HelperService } from './helper.service';
import { SaveStateService } from './save-state.service';

@Injectable()
export class NavigationService {
  // private navLinks: string[] = [];
  // private nav: Observable<string>;
  public bodyBlock: string;
  public folders: Folder[];
  public navLinks: Folder[];
  constructor(
    private httpClient: HttpClient,
    private saveState: SaveStateService,
    private helperService: HelperService
  ) {
    this.initNavigation();
  }

  toggleNotes() {
    console.log('test');
  }

  btnPoetryPress(): void {
    this.saveState.data.poetryVisible = !this.saveState.data.poetryVisible;
    this.saveState.save();
  }
  btnSecondaryNotesPress(): void {
    this.saveState.data.secondaryNotesVisible = !this.saveState.data
      .secondaryNotesVisible;
    this.saveState.save();
  }
  btnOriginalNotesPress(): void {
    this.saveState.data.originalNotesVisible = !this.saveState.data
      .originalNotesVisible;
    this.saveState.save();
  }
  btnTranslatorNotesPress(): void {
    this.saveState.data.translatorNotesVisible = !this.saveState.data
      .translatorNotesVisible;
    this.saveState.save();
  }
  btnEnglishNotesPress(): void {
    this.saveState.data.englishNotesVisible = !this.saveState.data
      .englishNotesVisible;
    this.saveState.save();
  }
  btnNewNotesPress(): void {
    this.saveState.data.newNotesVisible = !this.saveState.data.newNotesVisible;
    this.saveState.save();
  }
  toggleNavButton() {
    this.saveState.data.paragraphsVisible = !this.saveState.data
      .paragraphsVisible;
  }

  btnRightPanePress() {
    if (this.helperService.getWidth() >= 1080) {
      this.saveState.data.rightPanePin = !this.saveState.data.rightPanePin;
    } else {
      this.saveState.data.rightPaneToggle = !this.saveState.data
        .rightPaneToggle;
    }
    this.saveState.save();
  }
  btnLeftPanePress() {
    if (this.helperService.getWidth() >= 1280) {
      this.saveState.data.leftPanePin = !this.saveState.data.leftPanePin;
    } else {
      this.saveState.data.leftPaneToggle = !this.saveState.data.leftPaneToggle;
    }
    this.saveState.save();
  }
  btnParagraphPress() {
    this.saveState.data.paragraphsVisible = !this.saveState.data
      .paragraphsVisible;
    this.saveState.save();
  }

  setVisibility() {
    const folder = this.folders[0];
    console.log(folder);
    folder.setVisibility();
  }
  public getNavigation(manifest: string) {
    this.folders.forEach(f => {
      if (f.path === manifest) {
        this.navLinks = [];
        // this.navLinks = f.Folders;
        Object.assign(this.navLinks, f.folders);
        f.visible = !f.visible;
        console.log(this.navLinks);
        // f.setVisibility();
        return;
      }
    });
  }
  public getNavigation2() {
    return this.httpClient.get('assets/nav/nav.json', {
      responseType: 'text'
    });
  }
  public getChapter(book: string, chapter: string): Observable<string> {
    const url = this.urlBuilder(book, chapter);
    return this.httpClient.get(url, { observe: 'body', responseType: 'text' });
  }

  private urlBuilder(book: string, chapter: string): string {
    const url = 'assets/scriptures/';
    const urlEnd = book + '/' + chapter + '.html';
    if (chapter === '') {
      return url + 'tg/' + book + '.html';
    }
    switch (book) {
      case 'gs':
      case 'triple-index':
      case 'harmony': {
        return url + urlEnd;
      }
      default: {
        let testament = '';
        switch (book) {
          case '1-chr':
          case '1-kgs':
          case '1-sam':
          case '2-chr':
          case '2-kgs':
          case '2-sam':
          case 'amos':
          case 'dan':
          case 'deut':
          case 'eccl':
          case 'esth':
          case 'ex':
          case 'ezek':
          case 'ezra':
          case 'gen':
          case 'hab':
          case 'hag':
          case 'hosea':
          case 'isa':
          case 'jer':
          case 'job':
          case 'joel':
          case 'jonah':
          case 'josh':
          case 'judg':
          case 'lam':
          case 'lev':
          case 'mal':
          case 'micah':
          case 'nahum':
          case 'neh':
          case 'num':
          case 'obad':
          case 'prov':
          case 'ps':
          case 'ruth':
          case 'song':
          case 'zech':
          case 'zeph': {
            testament = 'ot/';
            break;
          }
          case '1-cor':
          case '1-jn':
          case '1-pet':
          case '1-thes':
          case '1-tim':
          case '2-cor':
          case '2-jn':
          case '2-pet':
          case '2-thes':
          case '2-tim':
          case '3-jn':
          case 'acts':
          case 'col':
          case 'eph':
          case 'gal':
          case 'heb':
          case 'james':
          case 'john':
          case 'jude':
          case 'luke':
          case 'mark':
          case 'matt':
          case 'philem':
          case 'philip':
          case 'rev':
          case 'rom':
          case 'titus': {
            testament = 'nt/';
            break;
          }
          case '1-ne':
          case '2-ne':
          case '3-ne':
          case '4-ne':
          case 'alma':
          case 'enos':
          case 'ether':
          case 'hel':
          case 'jacob':
          case 'jarom':
          case 'morm':
          case 'moro':
          case 'mosiah':
          case 'omni':
          case 'w-of-m': {
            testament = 'bofm/';
            break;
          }
          case 'jst-1-chr':
          case 'jst-1-cor':
          case 'jst-1-jn':
          case 'jst-1-pet':
          case 'jst-1-sam':
          case 'jst-1-thes':
          case 'jst-1-tim':
          case 'jst-2-chr':
          case 'jst-2-cor':
          case 'jst-2-pet':
          case 'jst-2-sam':
          case 'jst-2-thes':
          case 'jst-acts':
          case 'jst-amos':
          case 'jst-col':
          case 'jst-deut':
          case 'jst-eph':
          case 'jst-ex':
          case 'jst-gal':
          case 'jst-gen':
          case 'jst-heb':
          case 'jst-isa':
          case 'jst-james':
          case 'jst-jer':
          case 'jst-john':
          case 'jst-luke':
          case 'jst-mark':
          case 'jst-matt':
          case 'jst-ps':
          case 'jst-rev':
          case 'jst-rom': {
            testament = 'jst/';
            break;
          }
          case 'abr':
          case 'a-of-f':
          case 'js-h':
          case 'js-m':
          case 'moses': {
            testament = 'pgp/';
            break;
          }
          case 'od':
          case 'dc': {
            testament = 'dc-testament/';
            break;
          }
          case 'quad': {
            testament = 'quad/';
            break;
          }
          default: {
            testament = '';
          }
        }
        // console.log(url + testament + urlEnd);
        this.bodyBlock = url + testament + urlEnd;
        return url + testament + urlEnd;
      }
    }
    // if (book.trim() !== '') {
    //   url += '*/';
    //   url += book + '/' + chapter + '.html';
    // }
    // return url;
  }

  private initNavigation() {
    this.httpClient
      .get('assets/nav/nav.json', {
        responseType: 'text'
      })
      .subscribe(s => {
        const raw = JSON.parse(s) as Folder[];
        this.folders = [];
        const asdf: FolderProtoType[] = [];

        Object.assign(asdf, raw);

        Object.assign(this.folders, raw);

        // this.folders = JSON.parse(s) as Folder[];
      });
  }
}