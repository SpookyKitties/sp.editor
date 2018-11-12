import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  faBars,
  faBookOpen,
  faGlobe,
  faListUl,
  faParagraph,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import * as lodash from 'lodash';
import { Note } from '../models/Note';
import { Note2 } from '../modelsJson/Note';
import { SecondaryNote } from '../modelsJson/SecondaryNote';
import { ChapterService } from '../services/chapter.service';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { StringService } from '../services/string.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, AfterViewInit {
  constructor(
    public chapterService: ChapterService,
    public navServices: NavigationService,
    public saveState: SaveStateService,
    private stringService: StringService,
    public sanitizer: DomSanitizer
  ) {}
  faBars = faBars;
  faParagraph = faParagraph;
  faBookOpen = faBookOpen;
  faPlus = faPlus;
  faListUl = faListUl;
  faGlobe = faGlobe;
  @ViewChildren('notes')
  notes!: QueryList<ElementRef>;

  async ngAfterViewInit() {
    await setTimeout(() => {
      this.notes.changes.subscribe(() => {
        this.chapterService.notes = this.notes.toArray();
      });
    }, 100);
  }
  ngOnInit() {}
  notePhraseClick(secondaryNote: SecondaryNote) {
    if (true) {
      let count = 0;

      const note = lodash.find(this.notes.toArray(), (n: ElementRef) => {
        return (n.nativeElement as Element).id === secondaryNote.id;
      });
      console.log(note);

      if (
        note &&
        (note.nativeElement as Element).classList.contains('verse-select-1')
      ) {
        // this.chapterService.resetVerseSelect();
        this.chapterService.resetVerseNotes();

        return;
      }
      this.chapterService.resetVerseNotes();

      this.chapterService.modifyWTags(
        (
          w: [
            string,
            string,
            string,
            string,
            string,
            string,
            number,
            string[],
            boolean
          ]
        ) => {
          w[0] = this.stringService.removeAttribute(w[0], 'note-select-1');
          if (lodash.includes(w[7], secondaryNote.id)) {
            console.log(w);

            w[0] = this.stringService.addAttribute(w[0], 'note-select-1');
            count++;
          }
        }
      );

      if (count > 0) {
        if (note) {
          (note.nativeElement as Element).classList.add('verse-select-1');
        }
      }
      console.log(secondaryNote.cn);
    }
  }

  noteButtonClick(note: Note2) {
    switch (note.o) {
      case true: {
        note.v = !note.v;
        break;
      }

      default: {
        note.o = true;

        note.v = !this.saveState.data.secondaryNotesVisible;
        break;
      }
    }
  }

  trackById(note: Note) {
    return note.id;
  }
}
