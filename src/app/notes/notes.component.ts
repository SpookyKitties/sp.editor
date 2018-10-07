import { Component, OnInit } from '@angular/core';
import { ChapterService } from '../services/chapter.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  faBars,
  faBookOpen,
  faGlobe,
  faListUl,
  faParagraph,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { Note } from '../models/Note';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  faBars = faBars;
  faParagraph = faParagraph;
  faBookOpen = faBookOpen;
  faPlus = faPlus;
  faListUl = faListUl;
  faGlobe = faGlobe;
  constructor(
    public chapterService: ChapterService,
    public navServices: NavigationService,
    private sanitizer: DomSanitizer,
    public saveState: SaveStateService,
    private router: Router
  ) {}

  getNotes(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.chapterService.notes);
  }
  ngOnInit() {}

  trackById(index: number, note: Note){
    return note.id;  }
}
