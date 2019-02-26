import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  faBars,
  faBookOpen,
  faGlobe,
  faListUl,
  faParagraph,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import * as lodash from 'lodash';
import { Note } from '../modelsJson/Note';
// import { SecondaryNote } from '../modelsJson/SecondaryNote';
import { W } from '../modelsJson/WTag';
import { ChapterService } from '../services/chapter.service';
import { EditService } from '../services/EditService';
import { NavigationService } from '../services/navigation.service';
import { SaveStateService } from '../services/save-state.service';
import { StringService } from '../services/string.service';
import { VerseSelectService } from '../services/verse-select.service';
import { DataService } from '../services/data.service';
import { SecondaryNote } from '../modelsJson/Chapter';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit, AfterViewInit {
  constructor(
    public chapterService: ChapterService,
    public navServices: NavigationService,
    public saveState: SaveStateService,
    private stringService: StringService,
    public sanitizer: DomSanitizer,
    public editService: EditService,
    public verseSelectService: VerseSelectService,
    public dataService: DataService,
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
    // await setTimeout(() => {
    //   this.notes.changes.subscribe(() => {
    //     this.verseSelectService.notes = this.notes.toArray();
    //   });
    // }, 0);
  }

  filterClassList(classList: string[]): string {
    if (!classList) {
      return '';
    }

    return classList.toString();
  }
  ngOnInit() {}
  notePhraseClick(secondaryNote: SecondaryNote) {
    console.log(secondaryNote.id);
    const clicked = secondaryNote.clicked;
    console.log(clicked);

    this.chapterService.resetNotes().then(() => {
      secondaryNote.clicked = clicked;
      if (clicked) {
        secondaryNote.clicked = false;
      } else {
        secondaryNote.clicked = true;
        this.dataService.verses.verses.forEach(verse => {
          verse.wTags.forEach(wTag => {
            if (wTag.refs && wTag.refs.includes(secondaryNote.id)) {
              wTag.selected = true;
            } else {
              wTag.selected = false;
            }
          });
        });
      }
    });
  }

  noteButtonClick(note: Note) {
    console.log(note);

    switch (note.override) {
      case true: {
        note.visible = !note.visible;
        break;
      }

      default: {
        note.override = true;

        note.visible = !this.saveState.data.secondaryNotesVisible;
        break;
      }
    }

    this.verseSelectService.setNoteVisibility(note);
  }

  trackById(note: Note) {
    return note.id;
  }
  showNote(secondaryNote: SecondaryNote): boolean {
    return this.verseSelectService.noteVisibility.get(secondaryNote.id);
  }
  showSecondaryNote(
    note: Note,
    seNote: [string, string, string, string],
  ): boolean {
    let vis = true;

    if (
      seNote[1].includes('-2') &&
      !this.saveState.data.secondaryNotesVisible
    ) {
      return false;
    }
    if (seNote[2].includes('reference-label')) {
      if (
        (seNote[2].includes('reference-label-quotation') &&
          !this.saveState.data.refQUO) ||
        (seNote[2].includes('reference-label-phrasing') &&
          !this.saveState.data.refPHR) ||
        (seNote[2].includes('reference-label-or') &&
          !this.saveState.data.refOR) ||
        (seNote[2].includes('reference-label-ie') &&
          !this.saveState.data.refIE) ||
        (seNote[2].includes('reference-label-hebrew') &&
          !this.saveState.data.refHEB) ||
        (seNote[2].includes('reference-label-greek') &&
          !this.saveState.data.refGR) ||
        (seNote[2].includes('reference-label-archaic') &&
          !this.saveState.data.refKJV) ||
        (seNote[2].includes('reference-label-historical') &&
          !this.saveState.data.refHST) ||
        (seNote[2].includes('reference-label-cr') &&
          !this.saveState.data.refCR) ||
        (seNote[2].includes('reference-label-alt') &&
          !this.saveState.data.refALT) ||
        (seNote[2].includes('reference-label-harmony') &&
          !this.saveState.data.refHMY) ||
        (seNote[2].includes('reference-label-tg') &&
          !this.saveState.data.refTG) ||
        (seNote[2].includes('reference-label-gs') && !this.saveState.data.refGS)
      ) {
        // console.log('gtcrd');
        return false;
      }
    }
    seNote[1].split(' ').forEach(c => {
      switch (c) {
        case 'note-phrase-eng-2': {
          if (this.getNoteVisibility(note)) {
            vis = false;
          }
          break;
        }
        case 'note-reference-eng-2': {
          if (this.getNoteVisibility(note)) {
            vis = false;
          }
          break;
        }
        case 'note-phrase-tc-2': {
          if (this.getNoteVisibility(note)) {
            vis = false;
          }
          break;
        }
        case 'note-reference-tc-2': {
          if (this.getNoteVisibility(note)) {
            vis = false;
          }
          break;
        }
        case 'note-phrase-new-2': {
          if (this.getNoteVisibility(note)) {
            vis = false;
          }
          break;
        }
        case 'note-reference-new-2': {
          if (this.getNoteVisibility(note)) {
            vis = false;
          }
          break;
        }
        default: {
          vis = vis;
        }
      }
    });
    // vis = false;
    return vis;
  }

  private getNoteVisibility(note: Note) {
    return (
      !this.saveState.data.secondaryNotesVisible ||
      (note.override && !note.visible)
    );
  }
}
